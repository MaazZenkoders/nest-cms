import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEmail()
  @IsNotEmpty()
  senderEmail: string;

  @IsEmail()
  @IsNotEmpty()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  senderType: 'student' | 'teacher';

  @IsString()
  @IsNotEmpty()
  receiverType: 'student' | 'teacher';

  @IsString()
  @IsNotEmpty()
  room_id: string;
}
