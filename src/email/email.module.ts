import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { NodemailerAdapter } from './adapters/node-mailer-adapter';

@Module({
  providers: [EmailService, NodemailerAdapter],
  imports: [ConfigModule],
  exports: [EmailService]
})
export class EmailModule {}
