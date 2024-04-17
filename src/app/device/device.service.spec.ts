import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
describe('DeviceService', () => {
  let service: DeviceService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceService, PrismaService],
    }).compile();
    service = module.get<DeviceService>(DeviceService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
