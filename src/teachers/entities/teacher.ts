import { Appointments } from 'src/appointments/entities/appointments';
import { AssignedCourses } from 'src/assignedcourses/entities/assignedcourses';
import { Chat } from 'src/chat-messages/entities/chats';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teachers' })
export class Teacher {
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  contact: number;

  @Column()
  age: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 'teacher' })
  role: string;

  @Column()
  address: string;

  @Column({ default: 'true' })
  is_verified: boolean;

  @Column({ default: 'false' })
  is_suspended: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => AssignedCourses, (assignedcourse) => assignedcourse.teacher)
  assignedcourses: AssignedCourses[];

  @OneToMany(() => Appointments, (appointment) => appointment.teacher)
  appointments: Appointments[];

  @OneToMany(() => Chat, (chat) => chat.senderTeacher)
  sentMessages: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiverTeacher)
  receivedMessages: Chat[];
}
