import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Teacher } from './entities/teacher';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTeacherDto } from './dto/updateteacher.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,

    private readonly httpService: HttpService,
  ) {}

  async getAllTeachers(paginationsearchdto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationsearchdto;
      const query = this.teacherRepository.createQueryBuilder('teachers');
      if (search) {
        query.where(
          'teachers.name LIKE :search OR teachers.email LIKE :search',
          { search: `%${search}%` },
        );
      }
      const [result, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async teacherProfile(email: string) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${email} not found`);
    }
    return teacher;
  }

  async updateTeacherProfile(
    email: string,
    updateteacherdto: UpdateTeacherDto,
  ) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${email} not found`);
    }
    this.teacherRepository.merge(teacher, updateteacherdto);
    await this.teacherRepository.save(teacher);
    return teacher;
  }

  async updateTeacherProfilePicture(email: string, file: Express.Multer.File) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Teacher with email ${email} not found`);
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
    teacher.image_url = imageUrl;
    await this.teacherRepository.save(teacher);
    return imageUrl;
  }

  async deleteTeacherById(email: string) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException(`Student with email ${email} doesnt exist`);
    }
    await this.teacherRepository.delete({ email });
    return `Teacher with email ${email} deleted successfully`;
  }
}
