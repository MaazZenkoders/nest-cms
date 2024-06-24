import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

UseGuards(RoleAuthorizationGuard)
@Role('admin')
@Controller('admins')
export class AdminsController {
    constructor(
        private readonly adminService: AdminsService,
      ) {}

    @Post('/suspendstudent')
    async suspendStudent (email:string) {
        const suspendedStudent = await this.adminService.suspendStudent(email)
        return {
            status: HttpCode(HttpStatus.OK),
            suspendedStudent,
            message:"Student suspended successfully."
        }
    }

    @Post('/suspendteacher')
    async suspendTeacher (email:string) {
        const suspendedTeacher = await this.adminService.suspendTeacher(email)
        return {
            status: HttpCode(HttpStatus.OK),
            suspendedTeacher,
            message:"Teacher suspended successfully."
        }
    }
}
