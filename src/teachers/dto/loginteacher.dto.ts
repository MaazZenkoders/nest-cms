import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginTeacherDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
