import { Injectable } from '@nestjs/common';
import { TransactionContext } from 'src/utils/db/transaction';
import { RequestEntity } from './entities/request.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { RequestDTO } from './dto/request.dto';
import { SendRequestDTO } from './dto/send-request.dto';
import { MailService } from 'src/mail/mail.service';
import { AppTypeEntity } from 'src/entities/AppType.entity';
import * as _ from 'lodash';
import { MailRequestDTO } from './dto/mail-request.dto';

@Injectable()
export class RequestService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly mailService: MailService,
    ) {}

    async getRequestsList(txn: TransactionContext) {
        return await txn.execute(async queryRunner => {
            const { 0: list, 1: count } = await queryRunner.manager.findAndCount(RequestEntity, {
                select: [
                    'target',
                    'lastName',
                    'firstName',
                    'phone',
                    'email',
                    'organizationName',
                    'companyInn',
                    'period',
                    'amount',
                ],
                relations: {
                    appType: true,
                },
            });

            return {
                count,
                list: this.mapper.mapArray(list, RequestEntity, RequestDTO),
            };
        });
    }

    async sendRequest(txn: TransactionContext, sendRequestDto: SendRequestDTO) {
        return await txn.executeInTransaction(async queryRunner => {
            const appType = await queryRunner.manager.findOne(AppTypeEntity, {
                where: {
                    name: sendRequestDto.appType,
                },
            });

            const requestEntity = queryRunner.manager.create(RequestEntity, {
                appType: { id: appType?.id },
                ..._.omit(sendRequestDto, 'appType'),
            });

            const insertedRequest = await queryRunner.manager.insert(RequestEntity, requestEntity);
            const insertedId = insertedRequest?.identifiers[0]?.id;

            const mailRequestDto = new MailRequestDTO(sendRequestDto);
            mailRequestDto.applicationId = insertedId;

            await this.mailService.sendBkRequestMessage(mailRequestDto);
        });
    }
}
