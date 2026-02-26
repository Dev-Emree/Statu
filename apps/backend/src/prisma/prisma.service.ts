import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const url = configService.get<string>('DATABASE_URL');
    if (!url) throw new Error('DATABASE_URL not found');

    // Remove 'file:' prefix.
    const dbPath = url.replace('file:', '');

    const adapter = new PrismaBetterSqlite3({
      url: dbPath
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
