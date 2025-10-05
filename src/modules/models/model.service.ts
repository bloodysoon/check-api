import { PrismaService } from 'nestjs-prisma';
import { Injectable, Logger } from '@nestjs/common';
import { sample, sortBy } from 'lodash';
import { addModel, getModels, getOnlineModels } from 'src/supa-api.service';
import * as _ from 'lodash';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Dirent } from 'fs';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getMany() {
    return await getOnlineModels()
  }
  /**
   * Returnează un model aleatoriu din baza de date.
   */
  async getRandomModel(): Promise<any> {
    try {
      const models = await getModels();
      if (!models || models.length === 0) {
        this.logger.warn('No models found');
        return null;
      }
      return sample(models);
    } catch (error) {
      this.logger.error('Failed to get random model', error);
      throw error;
    }
  }

  async add(body: { name: string }): Promise<void> {
    if (!body?.name || typeof body.name !== 'string' || body.name.length < 2) {
      throw new Error('Invalid model name');
    }
    try {
      await addModel(body.name);
    } catch (error) {
      this.logger.error('Failed to create model', error);
      throw error;
    }
  }

  async avatarUpload(id: number, link: string): Promise<any> {
    if (!id || typeof id !== 'number' || id < 1) throw new Error('Invalid id');
    if (!link || typeof link !== 'string' || !link.startsWith('http')) throw new Error('Invalid avatar link');
    try {
      this.logger.log(`Uploading avatar for model id ${id}: ${link}`);
      return await this.prisma.model.update({
        where: { id: Number(id) },
        data: { avatarLink: link },
      });
    } catch (error) {
      this.logger.error('Failed to update avatar', error);
      throw error;
    }
  }

  /**
   * Returnează lista modelelor și fișierele video asociate, optimizat cu Promise.all.
   */
  async getDataFromFolder(): Promise<{ modelName: string; videos: string[] }[]> {
    const basePath = 'D:/random/public/videos';
    let folders = [] as Awaited<ReturnType<typeof fs.readdir>>;
    try {
      folders = await fs.readdir(basePath, { withFileTypes: true });
    } catch (err) {
      this.logger.error(`Could not read base directory: ${basePath}`, err);
      throw new Error('Failed to read video base directory');
    }
    // Filter only directories
    const modelFolders = folders.filter(f => f.isDirectory());
    // Parallel read all files in all folders
    const result = await Promise.all(
      modelFolders.map(async (folder) => {
        const folderPath = path.join(basePath, folder.name);
        let files = [] as Awaited<ReturnType<typeof fs.readdir>>;
        try {
          files = await fs.readdir(folderPath, { withFileTypes: true });
        } catch (err) {
          this.logger.warn(`Could not read directory: ${folderPath}`, err);
          return null;
        }
        const paths = files.filter(f => f.isFile()).map(file => path.join(folder.name, file.name));
        return {
          modelName: folder.name,
          videos: _.shuffle(paths),
        };
      })
    );
    return result.filter(Boolean) as { modelName: string; videos: string[] }[];
  }

  async checkIfModelExists(modelName: string): Promise<{ exists: boolean; data:{
    modelName: string;
    videos: string[];
} }> {
    const models = await getModels();

  //get models from folder
    const modelsFromFolder = await this.getDataFromFolder();
    const modelExists = models.some(model => model.name === modelName) || modelsFromFolder.some(model => model.modelName === modelName);
    if(modelExists) {
      return {
        exists: true,
        data: modelsFromFolder.filter(model => model.modelName === modelName)[0],
      };
    }
    return {
      exists: false,
      data: {
        modelName: '',
        videos: [],
      },
    };
  }
}
