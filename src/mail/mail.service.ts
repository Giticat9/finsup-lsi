import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {MailRequestDTO} from 'src/request/dto/mail-request.dto';
import {CapitalizedClassProperties} from "../../@types/general";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {
    }

    async sendBkRequestMessage(mailRequestDto: MailRequestDTO, sender: string, to: string | string[]) {
        const mailContext: Omit<CapitalizedClassProperties<MailRequestDTO>, 'AppType' | 'Period' | 'IsFL'> = {
            ApplicationId: mailRequestDto.applicationId ?? '',
            Target: mailRequestDto.target ?? '',
            LastName: mailRequestDto.lastName ?? '',
            FirstName: mailRequestDto.firstName ?? '',
            Phone: mailRequestDto.phone ?? '',
            Email: mailRequestDto.email ?? '',
            OrganizationName: mailRequestDto.organizationName ?? '',
            CompanyInn: mailRequestDto.companyInn ?? '',
            Amount: mailRequestDto.amount ?? ''
        }

        return await this.mailerService.sendMail({
            sender,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject: `Заявка на продукт Банковская гарантия ИНН ${mailRequestDto.companyInn} / ${mailRequestDto.organizationName}`,
            template: 'BKRequestTemplate',
            context: mailContext,
        });
    }
}
