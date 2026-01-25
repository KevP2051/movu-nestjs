import { Injectable } from '@nestjs/common';
import { NodemailerAdapter } from './adapters/node-mailer-adapter';
import { join } from 'path';
import * as ejs from 'ejs';


@Injectable()
export class EmailService {
 
  constructor(
    private readonly emailSenderAdapter:NodemailerAdapter,
  ) {}


  async sendWelcomeEmail(to: string, name: string) {
    const html = await ejs.renderFile(
      join(__dirname, 'templates/welcome.ejs'),
      { name }
    );
    await this.emailSenderAdapter.sendMail({
      to,
      subject: '¡Bienvenido a la app!',
      html,
    });
  }
  
}
