import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import axios from 'axios';
import * as net from 'net';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  @Interval(5000) // Run every 5 seconds to check for due monitors
  async handleCron() {
    try {
      const monitors = await this.prisma.monitor.findMany();
      const now = Date.now();

      const dueMonitors = monitors.filter((m) => {
        const lastCheck = m.lastCheck ? m.lastCheck.getTime() : 0;
        // Run check if time elapsed >= interval (in seconds) * 1000
        return (now - lastCheck) >= (m.interval * 1000);
      });

      if (dueMonitors.length > 0) {
        this.logger.debug(`Checking ${dueMonitors.length} monitors...`);
        // Run checks in parallel
        await Promise.allSettled(dueMonitors.map((m) => this.checkMonitor(m)));
      }
    } catch (error) {
      this.logger.error('Error in monitoring loop', error);
    }
  }

  private async checkMonitor(monitor: any) {
    const start = Date.now();
    let status = 'DOWN';
    let latency = 0;

    try {
      if (monitor.type === 'HTTP') {
        const response = await axios.get(monitor.url, {
          timeout: 5000,
          validateStatus: () => true, // Don't throw on 4xx/5xx, handle manually
        });

        if (response.status >= 200 && response.status < 300) {
          status = 'UP';
        } else {
            status = 'DOWN';
        }
      } else if (monitor.type === 'TCP') {
        const parts = monitor.url.split(':');
        if (parts.length === 2) {
            const host = parts[0];
            const port = parseInt(parts[1], 10);
            const isOpen = await this.checkTcp(host, port);
            if (isOpen) status = 'UP';
        }
      }
    } catch (error) {
      status = 'DOWN';
    } finally {
      latency = Date.now() - start;
    }

    // 1. Save Heartbeat
    const heartbeat = await this.prisma.heartbeat.create({
      data: {
        monitorId: monitor.id,
        status,
        latency,
      },
    });

    // Emit Heartbeat
    this.eventsGateway.sendHeartbeat(heartbeat);

    // 2. Handle Incidents
    if (monitor.status === 'UP' && status === 'DOWN') {
      this.logger.warn(`Monitor ${monitor.name} went DOWN!`);
      const incident = await this.prisma.incident.create({
        data: {
          monitorId: monitor.id,
          status: 'OPEN',
        },
      });
      this.eventsGateway.sendIncident(incident);

    } else if (monitor.status === 'DOWN' && status === 'UP') {
      this.logger.log(`Monitor ${monitor.name} is back UP!`);
      // Close open incident
      const incident = await this.prisma.incident.findFirst({
        where: {
          monitorId: monitor.id,
          resolvedAt: null,
        },
      });
      if (incident) {
        const updatedIncident = await this.prisma.incident.update({
          where: { id: incident.id },
          data: {
            resolvedAt: new Date(),
            status: 'RESOLVED',
          },
        });
        this.eventsGateway.sendIncident(updatedIncident);
      }
    }

    // 3. Update Monitor
    await this.prisma.monitor.update({
      where: { id: monitor.id },
      data: {
        status,
        lastCheck: new Date(),
      },
    });
  }

  private checkTcp(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(5000);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.on('error', (err) => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    });
  }
}
