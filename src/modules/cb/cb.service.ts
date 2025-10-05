import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getModels, updateDbOnlineStatus, updateDbOnlineStatusToFalse, VideoModel } from 'src/supa-api.service';

const cbApi = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK';

// Define type for Chaturbate API response
interface CBApiModel {
  username: string;
  current_show: string;
  image_url: string;
  // add other fields if needed
}

@Injectable()
export class CBService {
  private readonly logger = new Logger(CBService.name);

  /**
   * Fetches Chaturbate API data
   */
  async getCbData(): Promise<CBApiModel[]> {
    try {
      const response = await fetch(cbApi);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      this.logger.error('Error fetching data from cbApi:', error instanceof Error ? error.stack : error);
      return [];
    }
  }

  /**
   * Cron job: Update models' online status every minute
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Update cb status');
    const models = await getModels();
    const cbData = await this.getCbData();

    await Promise.all(
      models.map(async (model: VideoModel) => {
        const wasOnline = model.isOnline;
        const res = await this.checkIfModelIsOnline(model.name, cbData);

        if (wasOnline !== res.isOnline) {
          if (res.isOnline) {
            this.logger.log(`${model.name} is online`);
            // Only update image URL if online
            await updateDbOnlineStatus(model.id!, res.imageUrl!, new Date());
          } else {
            this.logger.error(`${model.name} is offline`);
            await updateDbOnlineStatusToFalse(model.id!);
          }
        } else if (res.isOnline) {
          // Only update image URL if still online
          await updateDbOnlineStatus(model.id!, res.imageUrl!);
        }
        // If offline and status unchanged, do nothing
      })
    );
  }

  /**
   * Checks if a model is online in the Chaturbate data
   */
  private async checkIfModelIsOnline(modelUsername: string, data: CBApiModel[]): Promise<{ isOnline: boolean; imageUrl?: string }> {
    try {
      const model = data.find(
        (item) => item.username.toLowerCase() === modelUsername.toLowerCase()
      );
      if (model && model.current_show === 'public') {
        return {
          isOnline: true,
          imageUrl: model.image_url,
        };
      }
      return { isOnline: false };
    } catch (error) {
      this.logger.error('Error checking model status:', error instanceof Error ? error.stack : error);
      return { isOnline: false };
    }
  }
}
