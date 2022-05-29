import { Test, TestingModule } from '@nestjs/testing';
import { KeyController } from './key.controller';

describe('KeyController', () => {
  let controller: KeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyController]
    }).compile();

    controller = module.get<KeyController>(KeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
