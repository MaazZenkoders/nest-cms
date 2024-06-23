import { Test, TestingModule } from '@nestjs/testing';
import { AssignedcoursesController } from './assignedcourses.controller';

describe('AssignedcoursesController', () => {
  let controller: AssignedcoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignedcoursesController],
    }).compile();

    controller = module.get<AssignedcoursesController>(
      AssignedcoursesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
