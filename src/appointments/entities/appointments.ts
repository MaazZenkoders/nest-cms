import { Slots } from 'src/slots/entities/slots';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'appointments' })
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  rejected: boolean;

  @ManyToOne(() => Student, (student) => student.appointments)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.appointments)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @OneToOne(() => Slots)
  @JoinColumn({name : 'slot_id'})
  slots: Slots
}