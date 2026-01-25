import { Injectable } from '@nestjs/common';
import { NodemailerAdapter } from './adapters/node-mailer-adapter';

@Injectable()
export class EmailService {
 
  constructor(
    private readonly emailSenderAdapter:NodemailerAdapter,
  ) {}


  async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>¡Bienvenido, ${name}!</h2>
        <p>Gracias por registrarte en nuestra aplicación.</p>
        <p>¡Esperamos que disfrutes la experiencia!</p>
      </div>
    `;
    await this.emailSenderAdapter.sendMail({
      to,
      subject: '¡Bienvenido a la app!',
      html,
    });
  }
  
}
