import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admins/entities/admin';
import { Domain } from 'src/domains/entities/domain';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Admin, Domain])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
