import {
    IsString,
    IsNotEmpty,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    teacher_id: string;
  
    @IsNotEmpty()
    @IsString()
    slot_id: number;
  
    @IsNotEmpty()
    @IsString()
    student_id: string;

    @IsNotEmpty()
    @IsBoolean()
    rejected: boolean = false;
}