import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginAdminDto{

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string

}