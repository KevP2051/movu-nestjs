import { EmailSenderAdapter } from '../interfaces/email-sender-adapter.interface';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerAdapter implements EmailSenderAdapter {

    constructor(

        private readonly configService: ConfigService,

        private readonly transporter = transporter = nodemailer.createTransport({
            host: configService.get('emailService.smtpHost'),
            port: Number(configService.get('emailService.smtpPort')),
            secure: false,
            auth: {
                user: configService.get('emailService.smtpUser'),
                pass: configService.get('emailService.smtpPass'),
            },
        })) {

    }
    
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