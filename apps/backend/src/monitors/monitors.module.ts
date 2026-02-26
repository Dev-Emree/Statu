import { Module } from '@nestjs/common';
import { MonitorsController } from './monitors.controller';

@Module({
  controllers: [MonitorsController],
})
export class MonitorsModule {}
