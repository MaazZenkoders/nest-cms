import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

UseGuards(RoleAuthorizationGuard)
@Role('admin')
@Controller('teachers')
export class TeachersController {
    constructor(private readonly teacherService: TeachersService) {}

    @Get('/getAll')
    async getAllTeachers () {
        const teachers = await this.teacherService.getAllTeachers()
        return {
            status : HttpCode(HttpStatus.OK),
            teachers,
            message : 'Teachers retrieved successfully'
        }
    }

    @Get('/:email')
    async getStudentById(@Param('email') email: string) {
      const teacher = await this.teacherService.getTeacherById(email);
      return {
        status: HttpCode(HttpStatus.OK),
        teacher,
        message: 'Teacher recieved successfully',
      };
    }

    @Delete('/:email')
    async deleteStudentById(@Param('email') email: string) {
        await this.teacherService.deleteTeacherById(email);
        return {
        status: HttpCode(HttpStatus.OK),
        message: `Teacher with email ${email} deleted successfully`,
        };
    }
}



