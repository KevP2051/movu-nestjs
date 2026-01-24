import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load:[EnvConfiguration],
        validationSchema: JoiValidationSchema
      }
    ),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, 
      synchronize: true // Note: Set to false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
