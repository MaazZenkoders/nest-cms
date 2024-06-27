import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Student, Teacher])],
  providers: [AppointmentsService, EmailsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
