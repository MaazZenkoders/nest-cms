import { Module } from '@nestjs/common';
import { AssignedcoursesController } from './assignedcourses.controller';
import { AssignedcoursesService } from './assignedcourses.service';
import { AssignedCourses } from './entities/assignedcourses';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Student, AssignedCourses])],
  controllers: [AssignedcoursesController],
  providers: [AssignedcoursesService],
})
export class AssignedcoursesModule {}
