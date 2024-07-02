import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';
import { UpdateAdminDto } from './dto/updateadmin.dto';
import { FileInterceptor } from '@nestjs/platform-express';

UseGuards(RoleAuthorizationGuard);
@Role('admin')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Get('/profile/:email')
  async adminProfile(@Param('email') email: string) {
    const admin = await this.adminService.adminProfile(email);
    return {
      status: HttpCode(HttpStatus.OK),
      admin,
      message: 'Profile retrieved successfully',
    };
  }

  @Patch('/updateprofile/:email')
  async updateAdminProfile(
    @Param('email') email: string,
    @Body() updateadmindto: UpdateAdminDto,
  ) {
    const updatedProfile = await this.adminService.updateAdminProfile(
      email,
      updateadmindto,
    );
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfile,
      message: 'Profile updated successfully.',
    };
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('/updateprofilepicture/:email')
  async updateAdminProfilePicture(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updatedProfilePicture =
      await this.adminService.uploadAdminProfilePicture(file,email);
    return {
      status: HttpCode(HttpStatus.CREATED),
      updatedProfilePicture,
      message: 'Profile picture updated successfully.',
    };
  }

  @Post('/suspendstudent')
  async suspendStudent(email: string) {
    const suspendedStudent = await this.adminService.suspendStudent(email);
    return {
      status: HttpCode(HttpStatus.OK),
      suspendedStudent,
      message: 'Student suspended successfully.',
    };
  }

  @Post('/suspendteacher')
  async suspendTeacher(email: string) {
    const suspendedTeacher = await this.adminService.suspendTeacher(email);
    return {
      status: HttpCode(HttpStatus.OK),
      suspendedTeacher,
      message: 'Teacher suspended successfully.',
    };
  }
}
