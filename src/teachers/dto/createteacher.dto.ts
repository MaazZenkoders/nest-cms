import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  contact: number;

  @IsNotEmpty()
  @IsNumber()
  otp: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  role: string = 'teacher';

  @IsNotEmpty()
  @IsBoolean()
  is_verified: boolean = true;

  @IsNotEmpty()
  @IsBoolean()
  is_suspended: boolean = false;
}
