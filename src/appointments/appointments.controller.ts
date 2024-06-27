import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/createappointment.dto';
import { ApproveRejectAppointmentDto } from './dto/approvereject.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@UseGuards(RoleAuthorizationGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Role('student')
  @Post('/create')
  async createAppointment(@Body() createappointmentdto: CreateAppointmentDto) {
    const appointment =
      await this.appointmentsService.createAppointment(createappointmentdto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      appointment,
      message: 'Appointment created successfully',
    };
  }

  @Role('teacher', 'student')
  @Get('/:teacher_id')
  async getAppointmentsByTeacherId(@Param('teacher_id') teacher_id: string) {
    const appointments =
      await this.appointmentsService.getAppointmentsByTeacherId(teacher_id);
    return {
      status: HttpCode(HttpStatus.OK),
      appointments,
      message: 'Appointments retrieved successfully',
    };
  }

  @Role('teacher')
  @Post('/approvereject/:id')
  async approveRejectAppointment(
    @Body() approverejectappointmentdto: ApproveRejectAppointmentDto,
    @Param('id') id: number,
  ) {
    await this.appointmentsService.approveRejectAppointment(
      id,
      approverejectappointmentdto,
    );
    return {
      status: HttpCode(HttpStatus.OK),
      message: 'Appointment status updated successfully',
    };
  }
}
