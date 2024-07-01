import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class JoinRoomDto {
 @IsEmail()
 @IsNotEmpty()
 user_id:string


  @IsString()
  @IsNotEmpty()
  room_id: string;
}
