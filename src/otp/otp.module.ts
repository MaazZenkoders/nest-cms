import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp';
import { Admin } from 'src/admins/entities/admin';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, Admin, Student, Teacher])],
  providers: [OtpService,EmailsService],
  controllers: [OtpController],
})
export class OtpModule {}
