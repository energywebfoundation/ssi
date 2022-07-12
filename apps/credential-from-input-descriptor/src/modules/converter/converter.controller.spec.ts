import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';

const mockConverterService = {};

describe('ConverterController', () => {
  let controller: ConverterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
      providers: [
        {
          provide: ConverterService,
          useValue: mockConverterService
        }
      ]
    }).compile();

    controller = module.get<ConverterController>(ConverterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
