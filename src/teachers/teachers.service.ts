import { Injectable, NotFoundException } from '@nestjs/common';
import { Teacher } from './entities/teacher';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {

    constructor(
        @InjectRepository(Teacher)
        private teacherRepository: Repository<Teacher>,
      ) {}

        async getAllTeachers() {
            const teachers = await this.teacherRepository.find();
            return teachers;
        }
    
      async getTeacherById(email: string): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOneBy({ email });
        if (!teacher) {
          throw new NotFoundException(`Teacher with email ${email} not found`);
        }
        return teacher;
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
