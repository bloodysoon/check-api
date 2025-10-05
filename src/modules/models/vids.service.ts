import { model } from '.prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Injectable, Logger } from '@nestjs/common';
import { sample, sortBy } from 'lodash';

@Injectable()
export class VidsService {
  private readonly logger = new Logger(VidsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async update(body: { links: string[]; modelId: number }) {
    try {
      const videoData = body.links.map((link) => ({
        modelId: Number(body.modelId),
        link: link,
      }));

      await this.prisma.video.createMany({
        data: videoData,
      });

      return await this.prisma.model.findFirst({
        where:{
          id: Number(body.modelId)
        }
      })
    } catch (error) {
      this.logger.error('Failed to create videos', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.video.delete({
        where: { id: Number(id) },
        include:{
          model: true
        }
      });
    } catch (error) {
      this.logger.error('Failed to create videos', error);
      throw error;
    }
  }

  async checkModels(){}
}
