import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/createstudent.dto';
import { AuthService } from './auth.service';
import { CreateTeacherDto } from 'src/teachers/dto/createteacher.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/studentsignup')
  createStudent(@Body() createstudentdto: CreateStudentDto) {
    const user = this.authService.studentSignUp(createstudentdto);
    HttpCode(HttpStatus.CREATED);
    return user;
  }

  @Post('/teachersignup')
  createTeacher(@Body() createteacherdto: CreateTeacherDto) {
    const user = this.authService.teacherSignup(createteacherdto);
    HttpCode(HttpStatus.CREATED);
    return user;
  }
}
