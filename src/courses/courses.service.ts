import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/createcourse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course';
import { Enrollment } from 'src/enrollments/entities/enrollments';
import { AssignedCourses } from 'src/assignedcourses/entities/assignedcourses';
import { Teacher } from 'src/teachers/entities/teacher';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';
import { UpdateCourseDto } from './dto/updatecourse.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(AssignedCourses)
    private assignedCoursesRepoistory: Repository<AssignedCourses>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async createCourse(createcoursedto: CreateCourseDto) {
    const existingCourse = await this.courseRepository.findOneBy({
      course_code: createcoursedto.course_code,
    });
    if (existingCourse) {
      throw new HttpException(
        'This course already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const course = this.courseRepository.create({
      ...createcoursedto,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    await this.courseRepository.save(course);
    return course;
  }

  async updateCourseById(updatecoursedto: UpdateCourseDto, course_code: string) {
    const course = await this.courseRepository.findOneBy({course_code})
    if(!course){
      throw new BadRequestException("Course not found")
    }
    this.courseRepository.merge(course, updatecoursedto);
    await this.courseRepository.save(course);
    return course;
  }

  async getAllCourses(paginationsearchdto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationsearchdto;
      const query = this.courseRepository.createQueryBuilder('courses');
      if (search) {
        query.where(
          'courses.name LIKE :search OR courses.course_code LIKE :search',
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

  async deleteCourse(course_code: string) {
    const course = await this.courseRepository.findOneBy({ course_code });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { course: course },
      relations: ['course'],
    });
    if (existingEnrollment) {
      throw new BadRequestException(
        'This course cannot be deleted because enrollments are already in progress.',
      );
    }
    await this.courseRepository.remove(course);
  }

  async getStudentsInYourCourse(email: string, course_code: string) {
    const teacher = await this.teacherRepository.findOneBy({ email });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const course = await this.courseRepository.findOneBy({ course_code });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const existingAssignedCourse = await this.assignedCoursesRepoistory.findOne(
      {
        where: { course: course, teacher: teacher },
        relations: ['teacher', 'course'],
        select: {
          id: true,
          assign_date: true,
          teacher: {
            email: true,
          },
          course: {
            course_code: true,
          },
        },
      },
    );
    const existingEnrolledCourse = await this.enrollmentRepository.findOne({
      where: {
        course: { course_code: existingAssignedCourse.course.course_code },
      },
      relations: ['course'],
    });
    const enrolledStudents = await this.enrollmentRepository.findOne({
      where: {
        student: existingEnrolledCourse.student,
        course: existingEnrolledCourse.course,
      },
      relations: ['student', 'course'],
    });
    return enrolledStudents;
  }
}
