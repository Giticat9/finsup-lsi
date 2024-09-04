import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeormConfigService} from './typeorm/config.service';
import {TypeormInitService} from './typeorm/init.service';
import {LimitController} from './limit/limit.controller';
import {LimitService} from './limit/limit.service';
import {RequestController} from './request/request.controller';
import {RequestService} from './request/request.service';
import {AutomapperModule} from '@automapper/nestjs';
import {classes} from '@automapper/classes';
import {RequestProfile} from './request/automapper/request.profile';
import {MailerModule} from '@nestjs-modules/mailer';
import {MailService} from './mail/mail.service';
import {MailModule} from './mail/mail.module';
import {LogService} from './log/log.service';
import {LogProfile} from "./log/automapper/log.profile";
import {LogController} from "./log/log.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeormConfigService,
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),
        MailerModule,
        MailModule,
    ],
    controllers: [LimitController, RequestController, LogController],
    providers: [
        TypeormInitService,
        LimitService,
        RequestService,
        LogService,
        MailService,
        RequestProfile,
        LogProfile,
    ],
})
export class AppModule {
}
