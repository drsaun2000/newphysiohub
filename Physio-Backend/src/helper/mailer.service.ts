import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST, 
      port: Number(process.env.NODEMAILER_PORT), 
      secure: process.env.NODEMAILER_PORT === '465', 
      auth: {
        user: process.env.NODEMAILER_EMAIL, 
        pass: process.env.NODEMAILER_PASSWORD, 
      },
    });
  }

  async sendMail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"PhysioHub" <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: 'Your OTP - PhysioHub',
        text: `Your OTP is: ${otp}. It is valid for 10 minutes. Do not share this with anyone.`,
        html: `
          <p>Dear User,</p>
          <p>Your OTP : <strong>${otp}</strong></p>
          <p>This OTP will expire in 10 minutes. Do not share it with anyone.</p>
          <p>Best regards,<br/>PhysioHub Team</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}

