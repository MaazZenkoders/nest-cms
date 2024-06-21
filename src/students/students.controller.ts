import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@UseGuards(RoleAuthorizationGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Role('admin')
  @Get('/getAll')
  async getAllStudents() {
    const students = await this.studentService.getAllStudents();
    return {
      status: HttpCode(HttpStatus.OK),
      students,
      message: 'Students retrieved successfully',
    };
  }

  @Role('admin')
  @Get('/:email')
  async getStudentById(@Param('email') email: string) {
    const student = await this.studentService.getStudentById(email);
    return {
      status: HttpCode(HttpStatus.OK),
      student,
      message: 'Student recieved successfully',
    };
  }

  @Role('admin')
  @Delete('/:email')
  async deleteStudentById(@Param('email') email: string) {
    await this.studentService.deleteStudentById(email);
    return {
      status: HttpCode(HttpStatus.OK),
      message: `Student with email ${email} deleted successfully`,
    };
  }
}
