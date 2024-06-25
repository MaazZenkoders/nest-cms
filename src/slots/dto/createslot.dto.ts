import {
    IsString,
    IsNotEmpty,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateSlotDto {
    @IsNotEmpty()
    @IsString()
    duration: string;
  
    @IsNotEmpty()
    @IsString()
    slot_start: Date;
  
    @IsNotEmpty()
    @IsString()
    teacher_id: string;

    @IsNotEmpty()
    @IsBoolean()
    available: boolean = true;
}