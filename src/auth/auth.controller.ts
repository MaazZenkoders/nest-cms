import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/createstudent.dto';
import { AuthService } from './auth.service';
import { CreateTeacherDto } from 'src/teachers/dto/createteacher.dto';
import { CreateAdminDto } from 'src/admins/dto/createadmin.dto';
import { LoginStudentDto } from 'src/students/dto/loginstudent.dto';
import { LoginAdminDto } from 'src/admins/dto/loginadmin.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginteacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @Post('/studentsignup')
  async createStudent(
    @Body() createstudentdto: CreateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.authService.studentSignup(createstudentdto, file);
    return {
      status: HttpCode(HttpStatus.CREATED),
      data,
      message: 'Student created succesfully',
    };
  }

  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @Post('/teachersignup')
  async createTeacher(
    @Body() createteacherdto: CreateTeacherDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.authService.teacherSignup(createteacherdto, file);
    return {
      status: HttpCode(HttpStatus.CREATED),
      data,
      message: 'Teacher created succesfully',
    };
  }

  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @Post('/adminsignup')
  async createAdmin(
    @Body() createadmindto: CreateAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.authService.adminSignup(createadmindto, file);
    return {
      status: HttpCode(HttpStatus.CREATED),
      data,
      message: 'Admin created succesfully',
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('/studentlogin')
  async loginStudent(@Body() loginstudentdto: LoginStudentDto) {
    const data = await this.authService.studentLogin(loginstudentdto);
    return {
      status: HttpCode(HttpStatus.OK),
      data,
      message: 'Student logged in succesfully',
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('/teacherlogin')
  async loginTeacher(@Body() loginteacherdto: LoginTeacherDto) {
    const data = await this.authService.teacherLogin(loginteacherdto);
    return {
      status: HttpCode(HttpStatus.OK),
      data,
      message: 'Teacher logged in succesfully',
    };
  }

  @UsePipes(new ValidationPipe())
  @Post('/adminlogin')
  async loginAdmin(@Body() loginadmindto: LoginAdminDto) {
    const data = await this.authService.adminLogin(loginadmindto);
    return {
      status: HttpCode(HttpStatus.OK),
      data,
      message: 'Admin logged in succesfully',
    };
  }
}
