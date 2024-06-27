import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssignedCoursesDto } from './dto/createassignedcourses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignedCourses } from './entities/assignedcourses';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course';
import { Teacher } from 'src/teachers/entities/teacher';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';

@Injectable()
export class AssignedcoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(AssignedCourses)
    private assignedCoursesRepository: Repository<AssignedCourses>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async assignCourse(createassignedcoursesdto: CreateAssignedCoursesDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: createassignedcoursesdto.teacher_id },
    });
    const course = await this.courseRepository.findOne({
      where: { course_code: createassignedcoursesdto.course_code },
    });
    if (!teacher || !course) {
      throw new BadRequestException('Cannot assign course');
    }
    const alreadyAssigned = await this.assignedCoursesRepository.findOne({
      where: { teacher: teacher, course: course },
    });
    if (alreadyAssigned) {
      throw new BadRequestException(
        'This course is already assigned to the teacher',
      );
    }
    const assignment = this.assignedCoursesRepository.create({
      assign_date: new Date(),
      updated_at: new Date(),
      teacher: teacher,
      course: course,
    });
    await this.assignedCoursesRepository.save(assignment);
    return {
      teacher: teacher.email,
      course_code: course.course_code,
      date: assignment.assign_date,
    };
  }

  async getAllAssignedCourses(paginationsearchdto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationsearchdto;
      const query =
        this.assignedCoursesRepository.createQueryBuilder('assigned_courses');
      if (search) {
        query.where(
          'assigned_courses.teacher_id LIKE :search OR assigned_courses.course_code  LIKE :search',
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

  async getAssignedCourseByTeacherId(teacher_id: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const assignedCourses = await this.assignedCoursesRepository.find({
      where: { teacher: teacher },
      relations: ['teacher', 'course'],
    });
    return assignedCourses;
  }

  async deleteAssignedCourse(teacher_id: string, course_code: string) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const course = await this.courseRepository.findOne({
      where: { course_code: course_code },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const assignedCourse = await this.assignedCoursesRepository.findOne({
      where: { teacher: teacher, course: course },
      relations: ['course'],
    });
    if (!assignedCourse) {
      throw new NotFoundException('Assigned course not found');
    }
    await this.assignedCoursesRepository.remove(assignedCourse);
    return { message: 'Course assignment successfully deleted.' };
  }
}
