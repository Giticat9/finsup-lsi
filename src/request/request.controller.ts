import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { ReqTransaction } from 'src/decorators/transaction';
import { TransactionContext } from 'src/utils/db/transaction';
import { SendRequestDTO } from './dto/send-request.dto';
import { plainToClass } from 'class-transformer';
import { LogService } from 'src/log/log.service';
import { LogExecutorEnum, LogLevelEnum } from 'src/log/entities/log.entity';
import { AppTypeEnum } from 'src/entities/AppType.entity';

@Controller('api/request')
export class RequestController {
    constructor(
        private readonly requestService: RequestService,
        private readonly logService: LogService,
    ) {}

    @Get()
    async getRequestsList(@ReqTransaction() txn: TransactionContext) {
        return await this.requestService.getRequestsList(txn);
    }

    @Post('send')
    async sendRequest(
        @ReqTransaction() txn: TransactionContext,
        @Body() body: Record<string, any>,
    ) {
        await this.logService.writeLog(txn, {
            executor: LogExecutorEnum.REQUEST,
            type: LogLevelEnum.INFO,
            message: 'Запрос на добавление заявки',
            body: JSON.stringify(body),
        });

        const sendRequestDto = plainToClass(SendRequestDTO, body);

        if (
            sendRequestDto.appType === AppTypeEnum.FZ44 &&
            body?.lead_utm_attributes?.campaign === 'search_publication_nolead'
        ) {
            return;
        }

        await this.requestService.sendRequest(txn, sendRequestDto);
        return;
    }
}
