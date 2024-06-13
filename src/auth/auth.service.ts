import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { CreateStudentDto } from 'src/students/dto/createstudent.dto';
import { Student } from 'src/students/entities/student';
import { CreateTeacherDto } from 'src/teachers/dto/createteacher.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private TeacherRepository: Repository<Teacher>,
  ) {}

  async studentSignUp(createstudentdto: CreateStudentDto) {
    const existingUser = await this.StudentRepository.findOneBy({
      email: createstudentdto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Student with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.StudentRepository.create({
      ...createstudentdto,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.StudentRepository.save(user);
    return user;
  }

  async teacherSignup(createteacherdto: CreateTeacherDto) {
    const existingUser = await this.TeacherRepository.findOneBy({
      email: createteacherdto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Teacher with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.TeacherRepository.create({
      ...createteacherdto,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.TeacherRepository.save(user);
    return user;
  }
}
