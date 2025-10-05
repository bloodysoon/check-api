import { getOnlineModels } from 'src/supa-api.service';
import {
  Controller,
  Get,
  Param,
  DefaultValuePipe,
  ParseBoolPipe,
  Query,
  ParseIntPipe,
  Put,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { VideosService } from '../videos/videos.service';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly videosService: VideosService,
  ) {}

  @Get('/random')
  async getRandomeModel(): Promise<any> {
    return await this.modelService.getRandomModel();
  }
  @Get('/cb')
  async getRandomeCbModel(): Promise<any> {
    return await getOnlineModels();
  }

  @Get()
  async getTotal(): Promise<any> {
    return await this.modelService.getDataFromFolder();
  }

  @Post()
  async add(@Body() body: any): Promise<any> {
    await this.modelService.add(body);
    return 'ok';
  }

  @Post('avatar/:id')
  async uploadAvatar(
    @Param('id') id: number,
    @Body() body: { link: string },
  ): Promise<any> {
    return await this.modelService.avatarUpload(id, body.link);
  }
  
  @Get('sync')
  async syncModels() {
    return await this.videosService.syncModelsWithDatabase();
  }

  @Get('extension/:model')
  async checkIfExists(@Param('model') model: string,) {
    const re = await this.modelService.checkIfModelExists(model)
    console.log({re})
    return re
  }
}
