import { DeviceService } from './device.service';
import { DeviceModule } from './device.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';
describe('DeviceService', () => {
  let service: DeviceService;
  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [DeviceModule],
    });
    service = module.get<DeviceService>(DeviceService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
