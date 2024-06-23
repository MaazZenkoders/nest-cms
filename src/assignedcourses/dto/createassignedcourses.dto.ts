import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAssignedCoursesDto {
  @IsNotEmpty()
  assign_date: Date;

  @IsNotEmpty()
  @IsString()
  teacher_id: string;

  @IsNotEmpty()
  @IsString()
  course_code: string;
}
