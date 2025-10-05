import { Controller, Put, Body, Delete, Param } from '@nestjs/common';
import { VidsService } from './vids.service';

@Controller('vids')
export class VidsController {
  constructor(private readonly vidsService: VidsService) {}

  @Put()
  async updateVids(
    @Body() body: { links: string[]; modelId: number },
  ): Promise<any> {
    return await this.vidsService.update(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return await this.vidsService.delete(id);
  }
}
