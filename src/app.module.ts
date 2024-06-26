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
import { JwtModule } from '@nestjs/jwt';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'db_post',
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
      ],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'mysecret',
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
      Appointments
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
