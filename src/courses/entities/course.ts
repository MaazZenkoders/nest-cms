import { AssignedCourses } from 'src/assignedcourses/entities/assignedcourses';
import { Enrollment } from 'src/enrollments/entities/enrollments';
import { Transactions } from 'src/stripe/entities/transactions';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryColumn()
  course_code: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column()
  paid: string;

  @Column({ nullable: true })
  price: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Transactions, (transaction) => transaction.course)
  transactions: Transactions[];

  @OneToMany(() => AssignedCourses, (assignedcourse) => assignedcourse.course)
  assignedcourses: AssignedCourses[];
}
