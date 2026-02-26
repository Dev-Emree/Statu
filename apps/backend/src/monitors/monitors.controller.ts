import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMonitorDto } from './dto';

@Controller('monitors')
export class MonitorsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() createMonitorDto: CreateMonitorDto) {
    return this.prisma.monitor.create({
      data: {
        name: createMonitorDto.name,
        url: createMonitorDto.url,
        type: createMonitorDto.type,
        interval: createMonitorDto.interval,
      },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.monitor.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.monitor.findUnique({
      where: { id: parseInt(id) },
    });
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    const monitorId = parseInt(id);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const heartbeats = await this.prisma.heartbeat.findMany({
      where: {
        monitorId,
        timestamp: {
          gte: oneDayAgo,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    return heartbeats;
  }
}
