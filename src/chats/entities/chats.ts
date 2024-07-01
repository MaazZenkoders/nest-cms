import { ChatMessages } from 'src/chat-messages/entities/chat-messages';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ChatMessages, (chatMessage) => chatMessage.chat)
  messages: ChatMessages[];

  @ManyToOne(() => Student, (student) => student.chats)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.chats)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;
}
