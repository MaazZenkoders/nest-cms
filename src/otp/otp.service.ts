import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Otp } from './entities/otp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admins/entities/admin';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly emailService: EmailsService,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private TeacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private AdminRepository: Repository<Admin>,
  ) {}

  async generateOTP(email: string) {
    const code = crypto.randomBytes(3).toString('hex');
    const otp = this.otpRepository.create({
      email,
      code,
      expires_at: new Date(Date.now() + 1000 * 60 * 60),
    });
    await this.otpRepository.save(otp);
    await this.emailService.sendOTPEmail(email, code);
    return code;
  }

  async verifyOTP(email: string, code: string) {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp) {
      await this.deleteUser(email);
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < otp.created_at) {
      await this.deleteUser(email);
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.remove(otp);
    return true;
  }

  private async deleteUser(email: string) {
    const student = await this.StudentRepository.findOne({ where: { email } });
    if (student) {
      await this.StudentRepository.remove(student);
      return;
    }
    const teacher = await this.TeacherRepository.findOne({ where: { email } });
    if (teacher) {
      await this.TeacherRepository.remove(teacher);
      return;
    }
    const admin = await this.AdminRepository.findOne({ where: { email } });
    if (admin) {
      await this.AdminRepository.remove(admin);
      return;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
