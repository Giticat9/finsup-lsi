import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('SMTP_HOST'),
                    port: configService.get<number>('SMTP_PORT'),
                    secure: configService.get<boolean>('SMTP_SECURE'),
                    auth: {
                        user: configService.get<string>('SMTP_USER'),
                        pass: configService.get<string>('SMTP_PASS'),
                    },
                },
                defaults: {
                    from: configService.get<string>('SMTP_USER'),
                },
                template: {
                    dir: path.join(__dirname, '..', 'resources', 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
