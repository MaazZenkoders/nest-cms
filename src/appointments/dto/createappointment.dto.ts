import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MeetingStatus } from 'src/enums/meetingstatus';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  student_id: string;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsEnum(MeetingStatus)
  status: MeetingStatus;
}
