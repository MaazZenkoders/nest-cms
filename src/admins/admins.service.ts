import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { UpdateAdminDto } from './dto/updateadmin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private readonly httpService: HttpService,
  ) {}

  async adminProfile(email: string) {
    const admin = await this.adminRepository.findOneBy({ email });
    if (!admin) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return admin;
  }

  async updateAdminProfile(
    email: string,
    updateadmindto: UpdateAdminDto,
  ) {
    const admin = await this.adminRepository.findOneBy({ email });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    this.adminRepository.merge(admin, updateadmindto);
    await this.StudentRepository.save(admin);
    return admin;
  }

  async uploadAdminProfilePicture(file: Express.Multer.File, email: string) {
    const admin = await this.adminRepository.findOneBy({email})
    if(!admin){
      throw new BadRequestException('Admin not found')
    }
    let imageUrl: string;
    if (file) {
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
      imageUrl = response.data.data.url;
    }
    admin.image_url = imageUrl
    return imageUrl;
  }

  async suspendStudent(email: string) {
    const student = await this.StudentRepository.findOneBy({ email });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const suspendedStudent = { ...student, is_suspended: true };
    await this.StudentRepository.update(email, suspendedStudent);
    return suspendedStudent;
  }

  async suspendTeacher(email: string) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    const suspendedTeacher = { ...teacher, is_suspended: true };
    await this.teacherRepository.update(email, suspendedTeacher);
    return suspendedTeacher;
  }
}
