import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student';
import { UpdateStudentDto } from './dto/updatestudent.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    private readonly httpService: HttpService,
  ) {}

  async getAllStudents() {
    const students = await this.StudentRepository.find();
    return students;
  }

  async studentProfile(email: string) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async updateStudentProfile(
    email: string,
    updatestudentdto: UpdateStudentDto,
  ) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    this.StudentRepository.merge(student, updatestudentdto);
    await this.StudentRepository.save(student);
    return student;
  }

  async updateStudentProfilePicture(email: string, file: Express.Multer.File) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const form = new FormData();
    form.append('image', file.buffer, file.originalname);
    const apiKey = '783d9d256253126161eb9f6b79c5a81e';
    const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const response = await firstValueFrom(
      this.httpService.post(uploadUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      }),
    );
    const imageUrl = response.data.data.url;
    student.image_url = imageUrl;
    await this.StudentRepository.save(student);
    return imageUrl;
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
