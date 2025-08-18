import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SquadService } from './squad.service';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard'; // optional

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPlayers(@Query() query: Record<string, string>) {
    // pass all query params to service
    return this.squadService.getPlayers(query);
  }
}