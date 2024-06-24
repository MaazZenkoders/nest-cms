import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async suspendStudent(email: string) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const suspendedStudent = { ...student, is_suspended:true};
    await this.StudentRepository.update(email, suspendedStudent)
    return suspendedStudent;
  }

  async suspendTeacher(email: string) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const suspendedTeacher = { ...teacher, is_suspended:true};
    await this.teacherRepository.update(email, suspendedTeacher)
    return suspendedTeacher;
  }
}
