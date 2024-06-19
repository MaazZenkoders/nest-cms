import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
