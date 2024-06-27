import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { MeetingStatus } from 'src/enums/meetingstatus';

export class ApproveRejectAppointmentDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsEnum(MeetingStatus)
  status: MeetingStatus;
}
