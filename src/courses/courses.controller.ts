import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/createcourse.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';
import { UpdateAdminDto } from 'src/admins/dto/updateadmin.dto';

@UseGuards(RoleAuthorizationGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Role('admin')
  @Post('/create')
  async createCourse(@Body() createcoursedto: CreateCourseDto) {
    const course = await this.courseService.createCourse(createcoursedto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      course,
      message: 'Course created successfully.',
    };
  }

  @Role('admin')
  @Patch('/update')
  async updateCourseById(
    @Body() updatecoursedto: UpdateAdminDto,
    course_code: string,
  ) {
    const updatedCourse = await this.courseService.updateCourseById(
      updatecoursedto,
      course_code,
    );
    return {
      status: HttpCode(HttpStatus.OK),
      updatedCourse,
      message: 'Course updated successfully.',
    };
  }

  @Role('student', 'student', 'admin')
  @Get('/getAll')
  async getAllCourses(@Query() paginationsearchdto: PaginationSearchDto) {
    const courses = await this.courseService.getAllCourses(paginationsearchdto);
    return {
      status: HttpCode(HttpStatus.OK),
      courses,
      message: 'Courses retrieved successfully.',
    };
  }

  @Role('admin')
  @Delete('/:course_code')
  async deleteCourse(@Param('course_code') course_code: string) {
    await this.courseService.deleteCourse(course_code);
    return {
      status: HttpCode(HttpStatus.OK),
      message: 'Course deleted successfully.',
    };
  }

  @Role('teacher')
  @Get('/coursestudents')
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
