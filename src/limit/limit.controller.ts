import {BadRequestException, Body, Controller, Get, Post} from '@nestjs/common';
import {LimitService} from './limit.service';
import {TransactionContext} from 'src/utils/db/transaction';
import {ReqTransaction} from 'src/decorators/transaction';
import {ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {GetLimitsDTO} from "./dto/get-limit.dto";

@ApiTags('limits')
@Controller('api/limits')
export class LimitController {
    constructor(private readonly limitService: LimitService) {
    }

    @ApiOkResponse({description: 'Успешный ответ', type: GetLimitsDTO})
    @ApiInternalServerErrorResponse({description: 'Внутренняя ошибка сервера'})
    @Get()
    async get(@ReqTransaction() txn: TransactionContext) {
        return await this.limitService.getLimits(txn);
    }

    @Post()
    @ApiOkResponse({description: 'Данные обновлены', type: GetLimitsDTO})
    @ApiInternalServerErrorResponse({description: 'Внутренняя ошибка сервера'})
    @ApiConsumes('application/octet-stream')
    @ApiBody({type: Buffer})
    async update(@ReqTransaction() txn: TransactionContext, @Body() body: Buffer) {
        if (!body || !Buffer.isBuffer(body)) {
            throw new BadRequestException('Тело запроса пустое');
        }

        return await this.limitService.updateLimits(txn, body);
    }
}
