import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { strict } from 'assert';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const user = configService.get<string>(
          'MAILER_INCOMING_USER',
          'Dai2272005nv@gmail.com',
        );
        const pass = configService.get<string>(
          'MAILER_INCOMING_PASS',
          'kfrsonfulhxisjeb',
        );
        const port = Number(
          configService.get<number>('MAILER_INCOMING_PORT', 587),
        );
        const host = configService.get<string>(
          'MAILER_INCOMING_HOST',
          'smtp.gmail.com',
        );

        return {
          transport: {
            host,
            port,
            ignoreTLS: false,
            secure: false,
            auth: {
              user,
              pass,
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
