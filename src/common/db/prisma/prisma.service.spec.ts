import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('PrismaService', () => {
  let service: PrismaService;
  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [PrismaModule],
    });
    service = await module.resolve<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
