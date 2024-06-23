import { Test, TestingModule } from '@nestjs/testing';
import { AssignedcoursesService } from './assignedcourses.service';

describe('AssignedcoursesService', () => {
  let service: AssignedcoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedcoursesService],
    }).compile();

    service = module.get<AssignedcoursesService>(AssignedcoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
