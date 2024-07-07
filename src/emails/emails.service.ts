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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
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
    const { student, teacher, status } = appointmentDetails;
    const mailOptions = {
      from: 'maaz05.zenkoders@gmail.com',
      to: email,
      subject: 'Appointment Confirmation',
      text: `Dear <strong>${student}</strong>, your appointment with ${teacher} is ${status}.`,
      html: `<p>Dear ${student},</p>
             <p>Your appointment with <strong>${teacher}</strong> is <strong>${status}</strong>.</p>
             <p>Thank you.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendTransactionEmail(email: string, transactionDetails: any) {
    const { student, course, status } = transactionDetails;
    const mailOptions = {
      from: 'maaz05.zenkoders@gmail.com',
      to: email,
      subject: 'Transaction status',
      text: `Dear <strong>${student}</strong>, your transaction for course ${course} is ${status}.`,
      html: `<p>Dear ${student},</p>
             <p>Your transaction for course <strong>${course}</strong> is <strong>${status}</strong>.</p>
             <p>Thank you.</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
