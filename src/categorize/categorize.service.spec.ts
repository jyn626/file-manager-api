import { Test, TestingModule } from '@nestjs/testing';
import { CategorizeService } from './categorize.service';

describe('CategorizeService', () => {
  let service: CategorizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorizeService],
    }).compile();

    service = module.get<CategorizeService>(CategorizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
