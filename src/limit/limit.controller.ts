import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { LimitService } from './limit.service';
import { TransactionContext } from 'src/utils/db/transaction';
import { ReqTransaction } from 'src/decorators/transaction';

@Controller('api/limits')
export class LimitController {
    constructor(private readonly limitService: LimitService) {}

    @Get()
    async get(@ReqTransaction() txn: TransactionContext) {
        return await this.limitService.getLimits(txn);
    }

    @Post()
    async update(@ReqTransaction() txn: TransactionContext, @Body() body: Buffer) {
        if (!body || !Buffer.isBuffer(body)) {
            throw new BadRequestException('Тело запроса пустое');
        }

        return await this.limitService.updateLimits(txn, body);
    }
}
