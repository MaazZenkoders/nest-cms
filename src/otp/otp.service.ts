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

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.remove(otp);
    return true;
  }
}
