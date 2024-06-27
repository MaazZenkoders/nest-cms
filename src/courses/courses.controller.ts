import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/createcourse.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';

@UseGuards(RoleAuthorizationGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Role('teacher')
  @Post('/create')
  async createCourse(@Body() createcoursedto: CreateCourseDto) {
    const course = await this.courseService.createCourse(createcoursedto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      course,
      message: 'Course created successfully.',
    };
  }

  @Role('student', 'student', 'admin')
  @Get('/getAll')
  async getAllCourses(@Body() paginationsearchdto: PaginationSearchDto) {
    const courses = await this.courseService.getAllCourses(paginationsearchdto);
    return {
      status: HttpCode(HttpStatus.OK),
      courses,
      message: 'Courses retrieved successfully.',
    };
  }

  @Role('student', 'admin', 'teacher')
  @Get('/:course_code')
  async getCourseById(@Param('course_code') course_code: string) {
    const course = await this.courseService.getCourseById(course_code);
    return {
      status: HttpCode(HttpStatus.OK),
      course,
      message: 'Course retrieved successfully.',
    };
  }

  @Role('teacher')
  @Delete('/:course_code')
  async deleteCourse(@Param('course_code') course_code: string) {
    await this.courseService.deleteCourse(course_code);
    return {
      status: HttpCode(HttpStatus.OK),
      message: 'Course deleted successfully.',
    };
  }

  @Role('teacher')
  @Get()
  async getStudentsInYourCourse(
    @Param('email') email: string,
    @Param('course_code') course_code: string,
  ) {
    const enrolledStudents = await this.courseService.getStudentsInYourCourse(
      email,
      course_code,
    );
    return {
      status: HttpCode(HttpStatus.OK),
      enrolledStudents,
      message: 'Students enrolled in your course retrieved successfully.',
    };
  }
}
