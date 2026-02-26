import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from './monitoring.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import axios from 'axios';

jest.mock('axios');

describe('MonitoringService', () => {
  let service: MonitoringService;
  let prisma: any;
  let gateway: any;

  beforeEach(async () => {
    const prismaMock = {
      monitor: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      heartbeat: {
        create: jest.fn().mockResolvedValue({}),
      },
      incident: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const gatewayMock = {
      sendHeartbeat: jest.fn(),
      sendIncident: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: EventsGateway,
          useValue: gatewayMock,
        },
      ],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
    prisma = module.get<PrismaService>(PrismaService);
    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
