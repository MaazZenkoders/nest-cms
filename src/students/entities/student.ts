import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollments';
import { Appointments } from 'src/appointments/entities/appointments';
import { ChatMessages } from 'src/chat-messages/entities/chat-messages';
import { Chats } from 'src/chats/entities/chats';
import { Transactions } from 'src/stripe/entities/transactions';

@Entity({ name: 'students' })
export class Student {
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  contact: number;

  @Column({ nullable: true })
  image_url: string;

  @Column()
  age: number;

  @Column({ default: 'student' })
  role: string;

  @Column()
  address: string;

  @Column({ default: true })
  is_verified: boolean;

  @Column({ default: false })
  is_suspended: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Appointments, (appointment) => appointment.student)
  appointments: Appointments[];

  @OneToMany(() => ChatMessages, (chatMessage) => chatMessage.senderStudent)
  sentMessages: ChatMessages[];

  @OneToMany(() => ChatMessages, (chatMessage) => chatMessage.receiverStudent)
  receivedMessages: ChatMessages[];

  @OneToMany(() => Transactions, (transaction) => transaction.student)
  transactions: Transactions[];

  @OneToMany(() => Chats, (chat) => chat.student)
  chats: Chats[];
}
