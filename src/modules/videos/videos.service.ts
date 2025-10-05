import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import * as path from 'path';
import { addModel, getAllModels, getOnlineModels, deleteModelByName } from 'src/supa-api.service';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(VideosService.name);
  /**
   * Returns a paginated, shuffled list of videos from all model folders.
   * Optimized for speed using Promise.all and robust error handling.
   */
  async listVideosPaginated(page: number, pageSize: number): Promise<{ videos: { name: string; size: number; path: string }[]; total: number }> {
    // Input validation
    if (!Number.isInteger(page) || page < 1) throw new Error('Invalid page number');
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new Error('Invalid pageSize (1-100)');
    const videoBasePath = 'D:/random/public/videos';
    let folders: Dirent[] = [];
    try {
      folders = await fs.readdir(videoBasePath, { withFileTypes: true });
    } catch (err) {
      this.logger.error(`Could not read base directory: ${videoBasePath}`, err);
      throw new Error('Failed to read video base directory');
    }
    // Filter only directories
    const modelFolders = folders.filter(f => f.isDirectory());
    // Parallel read all files in all folders
    const videoList: { name: string; size: number; path: string }[] = (await Promise.all(
      modelFolders.map(async (folder) => {
        const folderPath = path.join(videoBasePath, folder.name);
        let files: Dirent[] = [];
        try {
          files = await fs.readdir(folderPath, { withFileTypes: true });
        } catch (err) {
          this.logger.warn(`Could not read directory: ${folderPath}`, err);
          return [];
        }
        // For each file, get stats in parallel
        const fileStats = await Promise.all(
          files.filter(f => f.isFile()).map(async (file) => {
            const filePath = path.join(folderPath, file.name);
            try {
              const stats = await fs.stat(filePath);
              return {
                name: file.name,
                size: stats.size,
                path: path.join(folder.name, file.name),
              };
            } catch (err) {
              this.logger.warn(`Could not stat file: ${filePath}`, err);
              return null;
            }
          })
        );
        return fileStats.filter(Boolean) as { name: string; size: number; path: string }[];
      })
    )).flat();
    // Shuffle and paginate
    const shuffledVideos = _.shuffle(videoList);
    const skip = (page - 1) * pageSize;
    const paginated = shuffledVideos.slice(skip, skip + pageSize);
    return {
      videos: paginated,
      total: shuffledVideos.length,
    };
  }

  async listFavoriteVideosPaginated(page: number, pageSize: number) {
    try {
      const videoBasePath = 'D:\\random\\public\\videos';
      const allowedModels = [
        'alyssmitsu',
        'alannarusselll',
        'lana_kane_',
        'taanni_bc',
        'aarilaviee',
        'allotropp',
        'appr0ved',
        'carolinefoxxx',
        'cielo69_',
        'felissiany',
        'girl_of_yourdreams_',
        'golden_bag',
        'gigi_squirty',
        'harubunny',
        'hi_popsy',
        'honey_devildoll',
        'hollyextra',
        'intim_mate',
        'intrigueeme',
        'ive_kitsun',
        'jeezy_jool',
        'jilly_wolly1',
        'judycarr',
        'lana_kane_',
        'laura_lee',
        'lika_moon',
        'liliaah',
        'lili_and_niki',
        'lolli_mary',
        'ririannamitch',
        'melisa_sim',
        'hemi_lou',
        'hell_lo',
        'ainaschavell',
        'mellisa_nets',
        'oooops__',
        'ortega00',
        'oh_honey_',
        'petite_amely',
        'pamelaryant',
        'rocketsgirl',
        'riskyproject',
        'ruby1chan',
        'soifiee',
        'smiling_riddle',
        'sonjashy',
        'sparklity',
        'stephaweb',
        'surisoyan',
        'sweet_littleee',
        'tayasha',
        'tender_diana',
        'tama_ye',
        'thisisamelia',
        'yui_mei',
        'ysann',
        'yourgasm',
        '_nerenu',
        '_o0o__',
        'sarahson',
        'seltin_sweety',
        'solarglar',
        'stephaweb',
        '_witch__',
        'mary_delray',
        'fernandax1_'
      ]; // numele folderelor permise

      const folders = await fs.readdir(videoBasePath, { withFileTypes: true });
      const videoList = [];
      const skip = (page - 1) * pageSize;
      const limit = pageSize;

      for (const folder of folders) {
        if (
          folder.isDirectory() &&
          allowedModels.includes(folder.name.toLowerCase()) // filtrează doar modelele permise
        ) {
          const folderPath = path.join(videoBasePath, folder.name);
          let files: Dirent[] = [];
          try {
            files = await fs.readdir(folderPath, { withFileTypes: true });
          } catch (err) {
            console.warn(`Could not read directory: ${folderPath}`, err);
            continue;
          }

          for (const file of files) {
            if (file.isFile()) {
              const filePath = path.join(folderPath, file.name);
              try {
                const stats = await fs.stat(filePath);
                videoList.push({
                  name: file.name,
                  size: stats.size,
                  path: path.join(folder.name, file.name),
                });
              } catch (err) {
                console.warn(`Could not stat file: ${filePath}`, err);
                continue;
              }
            }
          }
        }
      }

      // Shuffle video list using lodash
      const shuffledVideos = _.shuffle(videoList);
      return {
        videos: shuffledVideos.slice(skip, skip + limit),
        total: shuffledVideos.length,
      };
    } catch (e: any) {
      console.log('FAILED GET VIDEOS');
      console.log(e);
    }
  }

  async listAllVideos() {
    const videoBasePath = 'D:\\random\\public\\videos';
    const folders = await fs.readdir(videoBasePath, { withFileTypes: true });
    const videoList = [];

    for (const folder of folders) {
      if (folder.isDirectory()) {
        const folderPath = path.join(videoBasePath, folder.name);
        const files = await fs.readdir(folderPath, { withFileTypes: true });

        for (const file of files) {
          if (file.isFile()) {
            videoList.push(path.join(folder.name, file.name));
          }
        }
      }
    }
    // Shuffle video list using lodash
    return {
      videos: videoList,
      total: videoList.length,
    };
  }

  async listModelFolders() {
    const videoBasePath = 'D:\\random\\public\\videos';
    const folders = await fs.readdir(videoBasePath, { withFileTypes: true });
    const modelList = [];

    for (const folder of folders) {
      if (folder.isDirectory()) {
        modelList.push(folder.name);
      }
    }
    // Shuffle video list using lodash
    return modelList;
  }

  /**
   * Sincronizează modelele din foldere cu baza de date, rapid și robust.
   */
  async syncModelsWithDatabase(): Promise<void> {
    const modelList = await this.listModelFolders();
    const data = await getAllModels();
    if (!Array.isArray(data)) {
      this.logger.error('DB did not return a valid array');
      throw new Error('Failed to get models from DB');
    }

    const dbNames = new Set(data.map((m) => m.name));
    const fsNames = new Set(modelList);

    // Add models that exist in FS but not in DB
    const toAdd = modelList.filter((name) => !dbNames.has(name));
    // Delete models that exist in DB but not in FS
    const toDelete = data.filter((m) => !fsNames.has(m.name)).map((m) => m.name);

    await Promise.all([
      ...toAdd.map(async (name) => {
        await addModel(name);
        this.logger.log(`Added model to DB: ${name}`);
      }),
      ...toDelete.map(async (name) => {
        await deleteModelByName(name);
        this.logger.log(`Removed model from DB (not on disk): ${name}`);
      }),
    ]);
  }

  //de facut o fucntie care scoate toate vidourile cu link si cat volum are, sa fie sortat de la mare la mic

  /**
   * Returnează toate videourile cu link și dimensiune, sortate descrescător după volum. Optimizat cu Promise.all.
   */
  async getVideosSortedBySize(): Promise<{ link: string; sizeMB: string }[]> {
    const basePath = 'D:/random/public/videos';
    let folders: import('fs').Dirent[] = [];
    try {
      folders = await fs.readdir(basePath, { withFileTypes: true });
    } catch (err) {
      this.logger.error(`Could not read base directory: ${basePath}`, err);
      throw new Error('Failed to read video base directory');
    }
    const modelFolders = folders.filter(f => f.isDirectory());
    // Parallel read all files in all folders
    const videos = (await Promise.all(
      modelFolders.map(async (folder) => {
        const folderPath = path.join(basePath, folder.name);
        let files: import('fs').Dirent[] = [];
        try {
          files = await fs.readdir(folderPath, { withFileTypes: true });
        } catch (err) {
          this.logger.warn(`Could not read directory: ${folderPath}`, err);
          return [];
        }
        // For each file, get stats in parallel
        const fileStats = await Promise.all(
          files.filter(f => f.isFile()).map(async (file) => {
            const filePath = path.join(folderPath, file.name);
            try {
              const stats = await fs.stat(filePath);
              return {
                path: path.join(folder.name, file.name), // pentru client
                size: stats.size, // in bytes
              };
            } catch (err) {
              this.logger.warn(`Could not stat file: ${filePath}`, err);
              return null;
            }
          })
        );
        return fileStats.filter(Boolean) as { path: string; size: number }[];
      })
    )).flat();
    // Sortează descrescător după dimensiune
    videos.sort((a, b) => b.size - a.size);
    // Returnează array cu link și dimensiune în MB
    return videos.map((video) => ({
      link: video.path.replace(/\\/g, '/'), // compatibil web
      sizeMB: (video.size / (1024 * 1024)).toFixed(2),
    }));
  }
}

