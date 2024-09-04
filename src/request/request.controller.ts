import {Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe} from '@nestjs/common';
import {RequestService} from './request.service';
import {ReqTransaction} from 'src/decorators/transaction';
import {TransactionContext} from 'src/utils/db/transaction';
import {SendRequestDTO} from './dto/send-request.dto';
import {plainToClass} from 'class-transformer';
import {LogService} from 'src/log/log.service';
import {LogExecutorEnum, LogLevelEnum} from 'src/log/entities/log.entity';
import {AppTypeEnum} from 'src/entities/AppType.entity';
import {
    ApiBody,
    ApiConsumes,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger";
import {ReturnRequestDTO} from "./dto/request.dto";
import {GetLogDTO} from "../log/dto/get-log.dto";
import {GetRequestLogsQuery} from "./dto/get-logs-query.dto";

@ApiTags('requests')
@Controller('api/request')
export class RequestController {
    constructor(
        private readonly requestService: RequestService,
        private readonly logService: LogService,
    ) {
    }

    @Get()
    @ApiOperation({summary: 'Список заявок', description: 'Возвращает список заявок с количеством элементов'})
    @ApiConsumes('application/json')
    @ApiOkResponse({description: 'Успешный ответ', type: ReturnRequestDTO})
    @ApiInternalServerErrorResponse({description: 'Внутренняя ошибка сервера'})
    async getRequestsList(@ReqTransaction() txn: TransactionContext) {
        return await this.requestService.getRequestsList(txn);
    }

    @Post('send')
    @ApiOperation({
        summary: 'Создание новой заявки',
        description: 'Создание новой заявки с указанными данными и отправка ее на почту'
    })
    @ApiConsumes('application/json', 'application/x-www-form-urlencoded')
    @ApiBody({description: 'Тело запроса', required: true, type: SendRequestDTO})
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
            return HttpStatus.OK;
        }

        return await this.requestService.sendRequest(txn, sendRequestDto);
    }

    @Get('logs')
    @ApiOperation({
        summary: 'Запрос логов по заявкам', description: 'Запрашивает записи логов по заявкам'
    })
    @ApiConsumes('application/json')
    @ApiOkResponse({description: 'Записи логов успешно получены', type: GetLogDTO, isArray: true})
    @ApiInternalServerErrorResponse({description: 'Внутренняя ошибка сервера'})
    async getRequestLogs(@ReqTransaction() txn: TransactionContext,
                         @Query(new ValidationPipe({transform: true})) query: GetRequestLogsQuery) {
        return await this.requestService.getRequestLogs(txn, query);
    }
}
