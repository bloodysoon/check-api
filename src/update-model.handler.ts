import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChampService {
    constructor(private readonly  prisma: PrismaService){}

    async getModels(){
        const models = await this.prisma.model.findMany()
        return models
    }
}
