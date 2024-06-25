import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DeleteAppointmentDto {
  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsNumber()
  slot_id: number;
}
