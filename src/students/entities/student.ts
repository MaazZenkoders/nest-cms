import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  @Column({ default: 'false' })
  is_verified: boolean;

  @Column({ default: 'false' })
  is_suspended: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;
}
