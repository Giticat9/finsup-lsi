import {Injectable} from '@nestjs/common';
import {TransactionContext} from 'src/utils/db/transaction';
import {RequestEntity} from './entities/request.entity';
import {InjectMapper} from '@automapper/nestjs';
import {Mapper} from '@automapper/core';
import {RequestDTO} from './dto/request.dto';
import {SendRequestDTO} from './dto/send-request.dto';
import {MailService} from 'src/mail/mail.service';
import {AppTypeEntity} from 'src/entities/AppType.entity';
import * as _ from 'lodash';
import {MailRequestDTO} from './dto/mail-request.dto';
import {ConfigService} from "@nestjs/config";
import {LimitEntity} from "../limit/entities/limit.entity";
import {LogEntity, LogExecutorEnum} from "../log/entities/log.entity";
import {FindOptionsWhere} from "typeorm";
import {GetLogDTO} from "../log/dto/get-log.dto";
import {GetRequestLogsQuery} from "./dto/get-logs-query.dto";

@Injectable()
export class RequestService {
    private readonly sender: string;
    private readonly emailIfFlRequest: string | string[];
    private readonly emailIfInnInLimitsRequest: string | string[];
    private readonly emailIfInnNotInLimitsRequest: string | string[];

    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) {
        this.sender = configService.get<string>('SMTP_USER') ?? '';

        this.emailIfFlRequest = configService.get<string>('EMAIL_IF_FL_REQUEST')?.split(',') ?? '';
        this.emailIfInnInLimitsRequest =
            configService.get<string>('EMAIL_IF_INN_IN_LIMITS_REQUEST')?.split(',') ?? '';
        this.emailIfInnNotInLimitsRequest =
            configService.get<string>('EMAILS_IF_INN_NOT_IN_LIMITS_REQUEST')?.split(',') ?? '';
    }

    async getRequestsList(txn: TransactionContext) {
        return await txn.execute(async queryRunner => {
            const {0: list, 1: count} = await queryRunner.manager.findAndCount(RequestEntity, {
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
        return await txn.executeInTransaction(async (queryRunner, txn) => {
            const appType = await queryRunner.manager.findOne(AppTypeEntity, {
                where: {
                    name: sendRequestDto.appType,
                },
            });

            const requestEntity = queryRunner.manager.create(RequestEntity, {
                appType: {id: appType?.id},
                ..._.omit(sendRequestDto, 'appType'),
            });

            const insertedRequest = await queryRunner.manager.insert(RequestEntity, requestEntity);
            const insertedId = insertedRequest?.identifiers[0]?.id;

            const mailRequestDto = new MailRequestDTO(sendRequestDto);
            mailRequestDto.applicationId = insertedId;

            const mailingAddresses = await this.getAddressesToMailing(txn, sendRequestDto);
            await this.mailService.sendBkRequestMessage(mailRequestDto, this.sender, mailingAddresses);

            return insertedId;
        });
    }

    async getRequestLogs(txn: TransactionContext, query?: GetRequestLogsQuery) {
        return await txn.execute(async queryRunner => {
            const where: FindOptionsWhere<LogEntity> = {
                executor: LogExecutorEnum.REQUEST
            }

            if (query?.type) {
                where.type = query?.type
            }

            const logEntries = await queryRunner.manager.find(LogEntity, {
                select: [
                    'id',
                    'executor',
                    'type',
                    'message',
                    'body',
                    'createdAt'
                ],
                where
            });

            return this.mapper.mapArray(logEntries, LogEntity, GetLogDTO);
        })
    }

    private async getAddressesToMailing(txn: TransactionContext, sendRequestDto: SendRequestDTO) {
        return await txn.execute(async (_, txn) => {
            if (sendRequestDto.isFL) {
                return this.emailIfFlRequest;
            } else {
                const isInLimits = await this.checkInnInLimitsList(txn, sendRequestDto.companyInn);
                if (isInLimits) {
                    return this.emailIfInnInLimitsRequest;
                } else {
                    return this.emailIfInnNotInLimitsRequest
                }
            }
        })
    }

    private async checkInnInLimitsList(txn: TransactionContext, inn: string) {
        return await txn.execute(async queryRunner => {
            return await queryRunner.manager.existsBy(LimitEntity, {
                inn
            })
        })
    }
}
