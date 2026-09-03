import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { addModel } from 'src/supa-api.service';
import { CBService } from '../cb/cb.service';

@Controller('model')
export class ModelController {
  constructor(private readonly cbService: CBService) {}

  @Get('/cb')
  async getCbModels(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ): Promise<any> {
    const limitNumber = limit ? +limit || 20 : 20;
    const pageNumber = page ? +page || 1 : 1;
    return await this.cbService.getCbModels(limitNumber, pageNumber);
  }

  @Post('/cb')
  async createModel(
    @Body() body: { name: string; status?: string },
  ): Promise<{ ok: boolean }> {
    await addModel(body.name, body.status);
    return { ok: true };
  }

  @Post('/cb/sync')
  async syncWithCb(): Promise<{ ok: boolean }> {
    await this.cbService.syncWithCb();
    return { ok: true };
  }
}
