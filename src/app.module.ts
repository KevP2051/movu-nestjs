import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { TmdbModule } from './apis/tmdb/tmdb.module';
import { MoviesModule } from './movies/movies.module';
import { TmdbSyncModule } from './sync/tmdb-sync/tmdb-sync.module';
import { ContentModule } from './content/content.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        load: [EnvConfiguration],
        validationSchema: JoiValidationSchema
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        database: configService.get('database.name'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        autoLoadEntities: true,
        synchronize: true // Note: Set to false in production
      }),
    }),
    UsersModule,
    CommonModule,
    AuthModule,
    EmailModule,
    TmdbModule,
    MoviesModule,
    TmdbSyncModule,
    ContentModule,
    GenresModule,
  ],
})
export class AppModule { }
