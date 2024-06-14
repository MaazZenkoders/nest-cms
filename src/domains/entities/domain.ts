import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "domains"})
export class Domain {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    domain:string
}