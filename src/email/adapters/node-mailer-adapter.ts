import { EmailSenderAdapter } from '../interfaces/email-sender-adapter.interface';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerAdapter implements EmailSenderAdapter {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('emailService.smtpHost'),
      port: Number(this.configService.get('emailService.smtpPort')),
      secure: false,
      auth: {
        user: this.configService.get('emailService.smtpUser'),
        pass: this.configService.get('emailService.smtpPass'),
      },
    });
  }

  async sendMail({ to, subject, html, text, from }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: from || `"Movu" <${this.configService.get('emailService.smtpUser')}>`,
      to,
      subject,
      html,
      text,
    });
  }
}