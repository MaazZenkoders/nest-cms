import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/createcourse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
      ) {}

    async createCourse (createcoursedto: CreateCourseDto) {
        const existingCourse = await this.courseRepository.findOneBy({course_code:createcoursedto.course_code})
        if(existingCourse){
            throw new HttpException('This course already exists', HttpStatus.BAD_REQUEST)
        }
        const course = this.courseRepository.create({
            ...createcoursedto,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        })
        return course;
    }

    async getAllCourses () {
        const courses = await this.courseRepository.find()
        return courses
    }
}