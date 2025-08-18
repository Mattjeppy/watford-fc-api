import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SquadService {
  constructor(private prisma: PrismaService) {}

  async getPlayers(filters: Record<string, string>) {
  const where: any = {};
  for (const key in filters) {
    if (filters[key]) {
      if (['age', 'squadNumber', 'startYear', 'endYear', 'appearances', 'goals', 'assists'].includes(key)) {
        where[key] = Number(filters[key]);
      } else {
        where[key] = filters[key];
      }
    }
  }
  return this.prisma.squad.findMany({ where });
}
}