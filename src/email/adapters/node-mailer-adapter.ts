import { EmailSenderAdapter } from '../interfaces/email-sender-adapter.interface';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NodemailerAdapter implements EmailSenderAdapter{
    private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendMail({ to, subject, html, text, from }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: from || `"Tu App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
  }
    
}