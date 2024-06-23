import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Course } from 'src/courses/entities/course';
import { Teacher } from 'src/teachers/entities/teacher';

@Entity({ name: 'assigned_courses' })
export class AssignedCourses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  assign_date: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignedcourses)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Course, (course) => course.assignedcourses)
  @JoinColumn({ name: 'course_code' })
  course: Course;
}
