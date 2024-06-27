import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course';
import { Enrollment } from 'src/enrollments/entities/enrollments';
import { AssignedCourses } from 'src/assignedcourses/entities/assignedcourses';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment, AssignedCourses, Teacher]),
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
