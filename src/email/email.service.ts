import { Injectable } from '@nestjs/common';
import { NodemailerAdapter } from './adapters/node-mailer-adapter';
import { join } from 'path';
import * as ejs from 'ejs';
import { EmailType } from './enums/email-type.enum';


@Injectable()
export class EmailService {

  constructor(
    private readonly emailSenderAdapter: NodemailerAdapter,
  ) { }



  async sendWelcomeEmail(to: string, name: string) {
    const html = await ejs.renderFile(
      join(__dirname, 'templates/welcome.ejs'),
      { name }
    );
    await this.sendMailSafe({
      to,
      subject: '¡Bienvenido a la app!',
      html,
    }, EmailType.WELCOME);
  }

  async sendPasswordResetEmail(to: string, name: string, resetCode: string) {
    const html = await ejs.renderFile(
      join(__dirname, 'templates/reset-password.ejs'),
      { name, resetCode }
    );
    await this.sendMailSafe({
      to,
      subject: 'Restablecimiento de contraseña',
      html,
    },  EmailType.PASSWORD_RESET);
  }

  private async sendMailSafe(
    mailOptions: { to: string; subject: string; html: string },
    type: EmailType
  ) {
    try {
      await this.emailSenderAdapter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending ${type} email to ${mailOptions.to}:`, error.message);
    }
  }

}
