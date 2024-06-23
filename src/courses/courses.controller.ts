import {
  Body,
  Controller,
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
  async getAllCourses() {
    const courses = await this.courseService.getAllCourses();
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
}
