import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Course } from 'src/courses/entities/course';
import { Transactions } from './entities/transactions';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Course, Transactions]),ConfigModule],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule {}
