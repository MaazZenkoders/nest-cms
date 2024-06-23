import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  UseGuards,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { UpdateStudentDto } from './dto/updatestudent.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Role('admin', 'student')
  @Get('/profile/:email')
  async studentProfile(@Param('email') email: string) {
    const student = await this.studentService.studentProfile(email);
    return {
      status: HttpCode(HttpStatus.OK),
      student,
      message: 'Profile retrieved successfully',
    };
  }

  @Role('student')
  @Patch('/updateprofile/:email')
  async updateStudentProfile(
    @Param('email') email: string,
    @Body() updatestudentdto: UpdateStudentDto,
  ) {
    const updatedProfile = await this.studentService.updateStudentProfile(
      email,
      updatestudentdto,
    );
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfile,
      message: 'Profile updated successfully.',
    };
  }

  @Role('student')
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/updateprofilepicture/:email')
  async updateStudentProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedProfilePicture =
      await this.studentService.updateStudentProfilePicture(email, file);
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfilePicture,
      message: 'Profile picture updated successfully.',
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
