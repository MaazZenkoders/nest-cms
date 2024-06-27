import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/createappointment.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student';
import { Appointments } from './entities/appointments';
import { InjectRepository } from '@nestjs/typeorm';
import { ApproveRejectAppointmentDto } from './dto/approvereject.dto';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly emailService: EmailsService,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Appointments)
    private appointmentRepository: Repository<Appointments>,
  ) {}

  async createAppointment(createappointmentdto: CreateAppointmentDto) {
    const student = await this.StudentRepository.findOne({
      where: { email: createappointmentdto.student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found.');
    }
    const teacher = await this.teacherRepository.findOne({
      where: { email: createappointmentdto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }
    const appointment = this.appointmentRepository.create({
      student: student,
      teacher: teacher,
      start_time: createappointmentdto.start_time,
      end_time: createappointmentdto.end_time,
      date: createappointmentdto.date,
      created_at: new Date(),
    });
    await this.appointmentRepository.save(appointment);
    return {
      student_id: student.email,
      teacher_id: teacher.email,
      date: appointment.date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
    };
  }

  async getAppointmentsByTeacherId(teacher_id: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }
    const appointments = await this.appointmentRepository.find({
      where: { teacher: teacher },
      relations: ['teacher', 'student'],
    });
    return appointments;
  }

  async approveRejectAppointment(
    id: number,
    approverejectappointmentdto: ApproveRejectAppointmentDto,
  ) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: approverejectappointmentdto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found.');
    }
    const student = await this.StudentRepository.findOne({
      where: { email: approverejectappointmentdto.student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found.');
    }
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }
    appointment.status = approverejectappointmentdto.status;
    await this.emailService.sendAppointmentEmail(student.email, {
      student: student.name,
      teacher: teacher.name,
      status: approverejectappointmentdto.status,
    });
    await this.appointmentRepository.save(appointment);
  }
}
