import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admins/entities/admin';
import { Domain } from 'src/domains/entities/domain';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Otp } from 'src/otp/entities/otp';
import { OtpModule } from 'src/otp/otp.module';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    OtpModule,
    TypeOrmModule.forFeature([Student, Teacher, Admin, Domain, Otp]),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService],
})
export class AuthModule {}
