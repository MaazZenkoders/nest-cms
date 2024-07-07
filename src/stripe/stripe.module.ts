import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Course } from 'src/courses/entities/course';
import { Transactions } from './entities/transactions';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Course, Transactions]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, EmailsService],
})
export class StripeModule {}
