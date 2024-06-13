import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Student,Teacher])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
