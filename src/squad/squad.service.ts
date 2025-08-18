import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SquadService {
  constructor(private prisma: PrismaService) {}

  async getAllPlayers() {
    return this.prisma.squad.findMany({
      orderBy: { name: 'asc' }, // optional, order alphabetically
    });
  }
}