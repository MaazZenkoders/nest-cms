import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/createenrollment.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@UseGuards(RoleAuthorizationGuard)
@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentService: EnrollmentsService) {}

    @Role('student')
    @Post('/create')
    async createEnrollment(@Body() createenrollmentdto:CreateEnrollmentDto){
        const enrollment = await this.enrollmentService.createEnrollment(createenrollmentdto)
        return{
            status: HttpCode(HttpStatus.CREATED),
            enrollment,
            message:'Enrollment created.'
        }
    }

    @Role('student')
    @Get('/:student_id')
    async getEnrollmentsByStudentId(@Param('student_id') student_id: string) {
    const enrollments = this.enrollmentService.getEnrollmentsByStudentId(student_id);
    return {
        status: HttpCode(HttpStatus.OK),
        enrollments,
        message:"Enrollments retrieved successfully."
    }
  }
}