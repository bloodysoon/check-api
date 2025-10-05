import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { VidsController } from './vids.controller';
import { VidsService } from './vids.service';
import { CheckedModelService } from './checked-model.service';
import { CheckedModelController } from './checked-model.controller';
import { VideosModule } from '../videos/videos.module';

@Module({
  imports: [VideosModule],
  providers: [ModelService, VidsService, CheckedModelService],
  exports: [ModelService, CheckedModelService],
  controllers: [ModelController, VidsController, CheckedModelController],
})
export class ModelModule {}
