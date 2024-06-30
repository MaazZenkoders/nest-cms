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
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ChatMessages, (chatMessage) => chatMessage.chat)
  messages: ChatMessages[];

  @ManyToOne(() => Student, (student) => student.chats)
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.chats)
  teacher: Teacher;
}
