import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailsService {
    private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'maaz05.zenkoders@gmail.com',
        pass: 'xwpc daco cflp lewl',
      },
    });
  }

  async sendOTPEmail(email: string, code: string) {
    const mailOptions = {
      from: 'maaz05.zenkoders@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${code}. Do not share it with anyone. It will expire in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${code}</strong>. Do not share it with anyone. It will expire in 5 minutes.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendAppointmentEmail(email: string, appointmentDetails: any) {
    const { student, teacher, start_time, end_time } = appointmentDetails;
    const mailOptions = {
      from: 'maaz05.zenkoders@gmail.com',
      to: email,
      subject: 'Appointment Confirmation',
      text: `Dear ${student}, your appointment with ${teacher} is confirmed from ${start_time} to ${end_time}.`,
      html: `<p>Dear ${student},</p>
             <p>Your appointment with <strong>${teacher}</strong> is confirmed from <strong>${start_time}</strong> to <strong>${end_time}</strong>.</p>
             <p>Thank you.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

