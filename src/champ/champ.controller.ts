import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChampService, RoundResult } from './champ.service';

@Controller('champ')
export class ChampController {
  constructor(private readonly service: ChampService) {}

  @Get()
  async getWinner() {
    return await this.service.getChampion();
  }

  @Post('duel')
  async duel(@Body() body: { user1: any; user2: any }): Promise<any> {
    console.log('Received duel request:', body);
    const duelResult = await this.service.duel(body.user1, body.user2);
    console.log(duelResult)
    return duelResult;
  }
}
