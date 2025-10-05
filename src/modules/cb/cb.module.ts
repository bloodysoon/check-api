import { Module } from '@nestjs/common';
import { CBService } from './cb.service';

@Module({
  providers: [CBService],
  exports: [CBService],
})
export class CBModule {}
