import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SquadService {
  private apiKey: string;
  private apiClient: any;

  constructor(private prisma: PrismaService) {
    this.apiKey = process.env.API_KEY ?? '';
    this.apiClient = axios.create({
      baseURL: 'https://api.football-data.org/v4',
      headers: {
        'X-Auth-Token': this.apiKey,
      },
    });
  }

  async getPlayersFromDb(filters: Record<string, string>) {
  // logic here would be to fetch players if database is not empty
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

  async getPlayersFromApi() {
    // improvement - get team id from http://api.football-data.org/v4/competitions/ELC/standings
    const url = '/teams/346';
    const response = await this.apiClient.get(url);
    // https://api.football-data.org/v4/teams/346
    console.debug('results:', response)
  }

  // get table standings
  // http://api.football-data.org/v4/competitions/ELC/standings

  // Watford id is 346

  // make a championship folder for:
  // table
  // next match against?
}