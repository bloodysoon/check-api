import { Module } from '@nestjs/common';
import { ChampService } from './champ.service';
import { ChampController } from './champ.controller';

@Module({
  providers: [ChampService],
  controllers: [ChampController]
})
export class ChampModule {}
