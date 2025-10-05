import { Module } from '@nestjs/common';
import { PrismaProvider } from './providers/prisma.provider';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { configArray, environmentSchema } from './config';
import { ScheduleModule } from '@nestjs/schedule';
import { ModelModule } from './modules/models/model.module';
import { CBModule } from './modules/cb/cb.module';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    CBModule,
    ModelModule,
    VideosModule,
    ScheduleModule.forRoot(),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaProvider,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentSchema,
      load: configArray,
    }),
  ],
})
export class AppModule {}
