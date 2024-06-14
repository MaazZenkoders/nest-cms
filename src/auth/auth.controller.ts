import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/createstudent.dto';
import { AuthService } from './auth.service';
import { CreateTeacherDto } from 'src/teachers/dto/createteacher.dto';
import { CreateAdminDto } from 'src/admins/dto/createadmin.dto';
import { LoginStudentDto } from 'src/students/dto/loginstudent.dto';
import { LoginAdminDto } from 'src/admins/dto/loginadmin.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginteacher.dto';
import { EmailAuthGuard } from 'src/guards/emailauthorization.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(EmailAuthGuard)
  @Post('/studentsignup')
  async createStudent(@Body() createstudentdto: CreateStudentDto) {
    const user = await this.authService.studentSignup(createstudentdto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      user,
      message: 'Student created succesfully',
    };
  }

  @UseGuards(EmailAuthGuard)
  @Post('/teachersignup')
  async createTeacher(@Body() createteacherdto: CreateTeacherDto) {
    const user = await this.authService.teacherSignup(createteacherdto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      user,
      message: 'Teacher created succesfully',
    };
  }

  @UseGuards(EmailAuthGuard)
  @Post('/adminsignup')
  async createAdmin(@Body() createadmindto: CreateAdminDto) {
    const user = await this.authService.adminSignup(createadmindto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      user,
      message: 'Admin created succesfully',
    };
  }

  @Post('/studentlogin')
  async loginStudent(@Body() loginstudentdto: LoginStudentDto) {
    const user = await this.authService.studentLogin(loginstudentdto);
    return {
      status: HttpCode(HttpStatus.OK),
      user,
      message: 'Student logged in succesfully',
    };
  }

  @Post('/teacherlogin')
  async loginTeacher(@Body() loginteacherdto: LoginTeacherDto) {
    const user = await this.authService.teacherLogin(loginteacherdto);
    return {
      status: HttpCode(HttpStatus.OK),
      user,
      message: 'Teacher logged in succesfully',
    };
  }

  @Post('/adminlogin')
  async loginAdmin(@Body() loginadmindto: LoginAdminDto) {
    const user = await this.authService.adminLogin(loginadmindto);
    return {
      status: HttpCode(HttpStatus.OK),
      user,
      message: 'Admin logged in succesfully',
    };
  }
}
