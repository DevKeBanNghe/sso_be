import { Module, ModuleMetadata } from '@nestjs/common';
import { AutoMockingTestingService } from './auto-mocking-testing.service';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

@Module({
  providers: [AutoMockingTestingService],
})
export class AutoMockingTestingModule {
  static async createTestingModule(metadata: ModuleMetadata) {
    return await Test.createTestingModule(metadata)
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
  }
}
