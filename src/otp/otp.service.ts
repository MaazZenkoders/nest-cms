import { HttpException, HttpStatus, Injectable,  } from '@nestjs/common';
import { Otp } from './entities/otp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
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

  async generateOTP(email: string): Promise<string> {
    const code = crypto.randomBytes(3).toString('hex');
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);
    const otp = this.otpRepository.create({ email, code, expires_at });
    await this.otpRepository.save(otp);
    return code;
  }

  async verifyStudentOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp ) {
      await this.StudentRepository.delete({email})
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < new Date()) {
      await this.StudentRepository.delete({email})
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  async verifyTeacherOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp ) {
      await this.TeacherRepository.delete({email})
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < new Date()) {
      await this.TeacherRepository.delete({email})
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  async verifyAdminOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp ) {
      await this.AdminRepository.delete({email})
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < new Date()) {
      await this.AdminRepository.delete({email})
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  // private async sendOTPEmail(email: string, code: string): Promise<void> {
  //   const transporter = nodemailer.createTransport({
  //     host: 'gmail',
  //     auth: {
  //       user: "maaz05.zenkoders@gmail.com",
  //       pass: 'xwpc daco cflp lewl',
  //     },
  //   });
  
  //   const mailOptions = {
  //     from: 'maaz05.zenkoders@gmail.com',
  //     to: email,
  //     subject: 'Your OTP Code',
  //     text: `Your OTP code is ${code}`,
  //   };
  //   await transporter.sendMail(mailOptions);
  // }
  
}
