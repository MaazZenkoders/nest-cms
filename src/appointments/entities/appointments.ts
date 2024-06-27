import { MeetingStatus } from 'src/enums/meetingstatus';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'appointments' })
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.pending,
  })
  status: MeetingStatus;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Student, (student) => student.appointments)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.appointments)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;
}
