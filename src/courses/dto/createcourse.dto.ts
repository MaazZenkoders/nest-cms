import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  course_code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  paid: string;

  @IsString()
  price: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  deadline: Date;
}
