import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VidsController } from './videos.controller';
import { ModelModule } from '../models/model.module';

@Module({
  providers: [VideosService],
  exports: [VideosService],
  controllers: [VidsController],
})
export class VideosModule {}
