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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { UpdateTeacherDto } from './dto/updateteacher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationSearchDto } from 'src/utils/dto/paginationsearch.dto';

UseGuards(RoleAuthorizationGuard);
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teacherService: TeachersService) {}

  @Role('admin')
  @Get('/getAll')
  async getAllTeachers(@Query() paginationsearchdto: PaginationSearchDto) {
    const teachers =
      await this.teacherService.getAllTeachers(paginationsearchdto);
    return {
      status: HttpCode(HttpStatus.OK),
      teachers,
      message: 'Teachers retrieved successfully',
    };
  }

  @Role('admin', 'teacher')
  @Get('/profile/:email')
  async teacherProfile(@Param('email') email: string) {
    const teacher = await this.teacherService.teacherProfile(email);
    return {
      status: HttpCode(HttpStatus.OK),
      teacher,
      message: 'Teacher recieved successfully',
    };
  }

  @Role('teacher')
  @Patch('/updateprofile/:email')
  async updateTeacherProfile(
    @Param('email') email: string,
    @Body() updateteacherdto: UpdateTeacherDto,
  ) {
    const updatedProfile = await this.teacherService.updateTeacherProfile(
      email,
      updateteacherdto,
    );
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfile,
      message: 'Profile updated successfully.',
    };
  }

  @Role('student')
  @UseInterceptors(FileInterceptor('image'))
  @Post('/updateprofilepicture/:email')
  async updateTeacherProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedProfilePicture =
      await this.teacherService.updateTeacherProfilePicture(email, file);
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfilePicture,
      message: 'Profile picture updated successfully.',
    };
  }

  @Delete('/:email')
  async deleteTeacherById(@Param('email') email: string) {
    await this.teacherService.deleteTeacherById(email);
    return {
      status: HttpCode(HttpStatus.OK),
      message: `Teacher with email ${email} deleted successfully`,
    };
  }
}
