import { IsString, IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class CreateOtpDto {

  @IsNotEmpty()
  @IsEmail()
  email:string

  @IsNotEmpty()
  @IsString()
  code: string;
}
