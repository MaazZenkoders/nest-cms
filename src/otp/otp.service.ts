import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Otp } from './entities/otp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
// import * as dotenv from 'dotenv';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async generateOTP(email: string): Promise<string> {
    const code = crypto.randomBytes(3).toString('hex');
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);
    const otp = this.otpRepository.create({ email, code, expires_at });
    await this.otpRepository.save(otp);
    return code;
    // await this.sendOTPEmail(email, code);
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    if (otp.expires_at < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    await this.otpRepository.delete({ id: otp.id });
    return true;
  }

  //   private async sendOTPEmail(email: string, code: string): Promise<void> {
  //     const transporter = nodemailer.createTransport({
  //       service: 'SendGrid',
  //       auth: {
  //         user: process.env.SENDGRID_USER,
  //         pass: process.env.SENDGRID_PASS,
  //       },
  //     });

  //     const mailOptions = {
  //       from: process.env.SENDGRID_USER,
  //       to: email,
  //       subject: 'Your OTP Code',
  //       text: `Your OTP code is ${code}`,
  //     };

  //     await transporter.sendMail(mailOptions);
  //   }
}
