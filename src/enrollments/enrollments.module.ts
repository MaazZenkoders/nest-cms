import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import { Enrollment } from './entities/enrollments';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Student, Enrollment])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, StripeService],
})
export class EnrollmentsModule {}
