import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailRequestDTO } from 'src/request/dto/mail-request.dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendBkRequestMessage(mailRequestDto: MailRequestDTO) {
        return await this.mailerService.sendMail({
            to: 'i.zhuravlev@etpgpb.ru',
            subject: `Заявка на продукт Банковская гарантия ИНН ${mailRequestDto.companyInn} / ${mailRequestDto.organizationName}`,
            template: 'BKRequestTemplate',
            context: mailRequestDto,
        });
    }
}
