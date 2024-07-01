import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateChatRoomDto {
  @IsEmail()
  @IsNotEmpty()
  student_id: string;

  @IsEmail()
  @IsNotEmpty()
  teacher_id:string
  
}