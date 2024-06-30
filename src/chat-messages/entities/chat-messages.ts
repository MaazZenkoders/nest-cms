import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Chats } from 'src/chats/entities/chats';

@Entity({ name: 'chat_messages' })
export class ChatMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Student, (student) => student.sentMessages)
  senderStudent: Student;

  @ManyToOne(() => Student, (student) => student.receivedMessages)
  receiverStudent: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.sentMessages)
  senderTeacher: Teacher;

  @ManyToOne(() => Teacher, (teacher) => teacher.receivedMessages)
  receiverTeacher: Teacher;

  @ManyToOne(() => Chats, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chats;
}
