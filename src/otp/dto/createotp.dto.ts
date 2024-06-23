import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
