import { Enrollment } from 'src/enrollments/entities/enrollments';
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
  deadline : Date

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}