import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/createappointment.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { Slots } from 'src/slots/entities/slots';
import { Student } from 'src/students/entities/student';
import { Appointments } from './entities/appointments';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteAppointmentDto } from './dto/deleteappointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Slots)
    private SlotRepository: Repository<Slots>,

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
    const slot = await this.SlotRepository.findOne({
      where: { slot_id: createappointmentdto.slot_id },
    });
    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }
    if (slot.available === false) {
      throw new ForbiddenException('This slot is already booked');
    }
    const appointment = this.appointmentRepository.create({
      student: student,
      teacher: teacher,
      slots: slot,
    });
    await this.appointmentRepository.save(appointment);
    const bookedSlot = { ...slot, available: false };
    await this.SlotRepository.update(createappointmentdto.slot_id, bookedSlot);
    return {
      student_id: student.email,
      teacher_id: teacher.email,
      slot_id: slot.slot_id,
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
      relations: ['teacher','student','slots'],
    });
    return appointments;
  }

  async deleteAppointment(id:number, deleteappointmentdto: DeleteAppointmentDto) {
    const teacher = await this.teacherRepository.findOne({
        where: { email: deleteappointmentdto.teacher_id },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found.');
      }
      const slot = await this.SlotRepository.findOne({
        where: { slot_id: deleteappointmentdto.slot_id },
      });
      if (!slot) {
        throw new NotFoundException('Slot not found.');
      }
     const appointment = await this.appointmentRepository.findOne({
        where: {slots:slot},
        relations: ['teacher','student','slots'],
     })
     const rejectedAppointment = {...appointment, rejected:true}
     await this.appointmentRepository.update(id,rejectedAppointment)
     const available_slot = {...slot, available:true}
     await this.SlotRepository.update(deleteappointmentdto.slot_id,available_slot)
  }
}
