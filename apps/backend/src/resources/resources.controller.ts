import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get('local')
  getLocalStats() {
    return this.resourcesService.getLocalStats();
  }

  // Future endpoint for agents to push data
  // @Post(':id')
  // pushStats(@Param('id') id: string, @Body() data: any) { ... }
}
