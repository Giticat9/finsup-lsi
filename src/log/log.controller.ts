import {Controller, Get, Query, ValidationPipe} from '@nestjs/common';
import {ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {LogService} from "./log.service";
import {ReqTransaction} from "../decorators/transaction";
import {TransactionContext} from "../utils/db/transaction";
import {GetLogQueryDTO} from "./dto/get-log-query.dto";
import {GetLogDTO} from "./dto/get-log.dto";

@ApiTags('logs')
@Controller('api/logs')
export class LogController {
    constructor(private readonly logService: LogService) {
    }

    @Get()
    @ApiConsumes('application/json')
    @ApiOkResponse({description: 'Записи логов успешно получены', type: GetLogDTO, isArray: true})
    @ApiInternalServerErrorResponse({description: 'Внутренняя ошибка сервера'})
    async getLogs(@ReqTransaction() txn: TransactionContext,
                  @Query(new ValidationPipe({transform: true})) query: GetLogQueryDTO) {
        return await this.logService.getLogs(txn, query);
    }
}
