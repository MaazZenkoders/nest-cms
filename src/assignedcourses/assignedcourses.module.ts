import { Module } from '@nestjs/common';
import { AssignedcoursesController } from './assignedcourses.controller';
import { AssignedcoursesService } from './assignedcourses.service';
import { AssignedCourses } from './entities/assignedcourses';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Teacher, AssignedCourses])],
  controllers: [AssignedcoursesController],
  providers: [AssignedcoursesService],
})
export class AssignedcoursesModule {}
