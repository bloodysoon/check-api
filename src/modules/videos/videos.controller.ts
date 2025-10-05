import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe  } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('vids')
export class VidsController {
  constructor(private readonly vidsService: VideosService) {}

  @Get()
  async getVideos(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<any> {
    return await this.vidsService.listVideosPaginated(page, pageSize);
  } 

   @Get("favorit")
  async getFavorits(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<any> {
    return await this.vidsService.listFavoriteVideosPaginated(page, pageSize);
  } 

  @Get('data')
  async getVideosData(): Promise<any> {
    return await this.vidsService.getVideosSortedBySize();
  }

}
