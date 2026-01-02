import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client';

export class PrismaClientSingleton {
  private static instance: PrismaClient;

  private constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

    PrismaClientSingleton.instance = new PrismaClient({ adapter });
  }

  public static getInstance(): PrismaClient {
    if (!this.instance) {
      new PrismaClientSingleton();
    }

    return PrismaClientSingleton.instance;
  }
}
