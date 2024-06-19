import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
  ) {}

  async getAllStudents() {
    const students = await this.StudentRepository.find();
    return students;
  }

  async getStudentById(email: string): Promise<Student> {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async deleteStudentById(email: string) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} doesnt exist`);
    }
    await this.StudentRepository.delete({ email });
    return `Student with email ${email} deleted successfully`;
  }
}
