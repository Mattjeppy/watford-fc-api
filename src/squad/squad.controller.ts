import { Controller, Get, UseGuards } from '@nestjs/common';
import { SquadService } from './squad.service';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard'; // optional

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.squadService.getAllPlayers();
  }
}