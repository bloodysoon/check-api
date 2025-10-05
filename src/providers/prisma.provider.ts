import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dbConfig from '../config/db.config';
import { PrismaOptionsFactory } from 'nestjs-prisma';

export class PrismaProvider implements PrismaOptionsFactory {
  constructor(
    @Inject(dbConfig.KEY) private readonly dbConf: ConfigType<typeof dbConfig>,
  ) {}

  createPrismaOptions() {
    return { prismaOptions: { datasources: { db: { url: this.dbConf.url } } } };
  }
}