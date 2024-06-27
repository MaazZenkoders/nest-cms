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
import { CreateAssignedCoursesDto } from './dto/createassignedcourses.dto';
import { AssignedcoursesService } from './assignedcourses.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';

// UseGuards(RoleAuthorizationGuard)
@Controller('assignedcourses')
export class AssignedcoursesController {
  constructor(
    private readonly assignedCoursesService: AssignedcoursesService,
  ) {}

  @Role('admin')
  @Post('/create')
  async createAssignedCourse(
    @Body() createassignedcoursesdto: CreateAssignedCoursesDto,
  ) {
    const assignedCourse = await this.assignedCoursesService.assignCourse(
      createassignedcoursesdto,
    );
    return {
      status: HttpCode(HttpStatus.CREATED),
      assignedCourse,
      message: 'Course assigned successfully',
    };
  }

  @Role('admin')
  @Get('/getAll')
  async getAllAssignedCourses(
    @Body() paginationsearchdto: PaginationSearchDto,
  ) {
    const assignedCourses =
      await this.assignedCoursesService.getAllAssignedCourses(
        paginationsearchdto,
      );
    return {
      status: HttpCode(HttpStatus.OK),
      assignedCourses,
      message: 'All assigned courses retrieved successfully.',
    };
  }

  @Role('admin', 'teacher')
  @Get('/:teacher_id')
  async getEnrollmentsByStudentId(@Param('teacher_id') teacher_id: string) {
    const assignCourses =
      await this.assignedCoursesService.getAssignedCourseByTeacherId(
        teacher_id,
      );
    return {
      status: HttpCode(HttpStatus.OK),
      assignCourses,
      message: 'Assigned courses retrieved successfully.',
    };
  }

  @Role('admin')
  @Delete()
  async deleteAssignedCourse(
    @Param('teacher_id') teacher_id: string,
    @Param('course_code') course_code: string,
  ) {
    await this.assignedCoursesService.deleteAssignedCourse(
      teacher_id,
      course_code,
    );
    return {
      status: HttpCode(HttpStatus.OK),
      message: 'Assigned course deleted successfully.',
    };
  }
}
