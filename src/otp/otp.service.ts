import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Otp } from './entities/otp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Admin } from 'src/admins/entities/admin';

@Injectable()
export class OtpService {
  constructor(
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
    await this.sendOTPEmail(email, code);
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

  private async sendOTPEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maaz05.zenkoders@gmail.com',
        pass: 'xwpc daco cflp lewl',
      },
    });
    const mailOptions = {
      from: 'maaz05.zenkoders@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${code}. Do not share it with anyone. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
  }
}
