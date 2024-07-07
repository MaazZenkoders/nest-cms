import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import { Enrollment } from './entities/enrollments';
import { StripeService } from 'src/stripe/stripe.service';
import { Transactions } from 'src/stripe/entities/transactions';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Student, Enrollment, Transactions]),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, StripeService, EmailsService],
})
export class EnrollmentsModule {}
