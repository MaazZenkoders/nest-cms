import {
    IsString,
    IsNotEmpty,
  } from 'class-validator';
  
  export class CreateEnrollmentDto {
    @IsNotEmpty()
    enrollment_date: Date;
  
    @IsNotEmpty()
    @IsString()
    student_id: string;
  
    @IsNotEmpty()
    @IsString()
    course_code: string;
  }
  