import { IsString, IsNotEmpty } from "class-validator";

export class CreateDomainDto{

    @IsNotEmpty()
    @IsString()
    domain:string;

}