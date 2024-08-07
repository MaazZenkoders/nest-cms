import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student';
import { TeachersModule } from './teachers/teachers.module';
import { Teacher } from './teachers/entities/teacher';
import { AdminsModule } from './admins/admins.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Admin } from './admins/entities/admin';
import { DomainsModule } from './domains/domains.module';
import { Domain } from './domains/entities/domain';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/entities/otp';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { Enrollment } from './enrollments/entities/enrollments';
import { AssignedcoursesModule } from './assignedcourses/assignedcourses.module';
import { AssignedCourses } from './assignedcourses/entities/assignedcourses';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointments } from './appointments/entities/appointments';
import { EmailsModule } from './emails/emails.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { ChatMessages } from './chat-messages/entities/chat-messages';
import { ChatsModule } from './chats/chats.module';
import { Chats } from './chats/entities/chats';
import { StripeModule } from './stripe/stripe.module';
import { Transactions } from './stripe/entities/transactions';
import { HttpModule } from '@nestjs/axios';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { EmailsService } from './emails/emails.service';
import { AuthService } from './auth/auth.service';
import { OtpService } from './otp/otp.service';
import { DomainsService } from './domains/domains.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'cms_db',
      entities: [
        Student,
        Teacher,
        Admin,
        Domain,
        Otp,
        Course,
        Enrollment,
        AssignedCourses,
        Appointments,
        ChatMessages,
        Chats,
        Transactions,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      Admin,
      Domain,
      Otp,
      Course,
      Enrollment,
      AssignedCourses,
      Appointments,
      ChatMessages,
      Chats,
      Transactions,
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    StudentsModule,
    TeachersModule,
    AdminsModule,
    DomainsModule,
    OtpModule,
    CoursesModule,
    EnrollmentsModule,
    AssignedcoursesModule,
    AppointmentsModule,
    EmailsModule,
    ChatMessagesModule,
    ChatsModule,
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController, StripeController],
  providers: [AppService, StripeService, EmailsService, AuthService, OtpService, DomainsService],
})
export class AppModule {}
