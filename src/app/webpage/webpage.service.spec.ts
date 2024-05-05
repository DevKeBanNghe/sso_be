import { WebpageService } from './webpage.service';
import { WebpageModule } from './webpage.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('WebpageService', () => {
  let service: WebpageService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [WebpageModule],
    });

    service = module.get<WebpageService>(WebpageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
