import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from 'src/teachers/entities/teacher';

@Entity({ name: 'available_slots' })
export class Slots {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @Column({type: 'timestamp'})
  slot_start:Date

  @Column()
  duration: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.slots)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({default: true})
  available: boolean;
}  