import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class ResourcesService {

  getLocalStats() {
    return {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpu: os.cpus(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: ((os.totalmem() - os.freemem()) / os.totalmem()) * 100
      },
      uptime: os.uptime(),
      loadavg: os.loadavg()
    };
  }
}
