import { Course } from 'src/courses/entities/course';
import { TransactionStatus } from 'src/enums/transactionstatus';
import { Student } from 'src/students/entities/student';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.pending,
  })
  status: TransactionStatus;

  @Column()
  payment_log: string

  @ManyToOne(() => Course, (course) => course.transactions)
  @JoinColumn({ name: 'course_code' })
  course: Course;

  @ManyToOne(() => Student, (student) => student.transactions)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}