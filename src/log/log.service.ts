import {BadRequestException, Injectable} from '@nestjs/common';
import {TransactionContext} from 'src/utils/db/transaction';
import {WriteLogDTO} from './dto/write-log.dto';
import {validate} from 'class-validator';
import {LogEntity} from './entities/log.entity';
import {GetLogQueryDTO} from "./dto/get-log-query.dto";
import {FindOptionsWhere} from "typeorm";
import {InjectMapper} from "@automapper/nestjs";
import {Mapper} from "@automapper/core";
import {GetLogDTO} from "./dto/get-log.dto";

@Injectable()
export class LogService {
    constructor(@InjectMapper() private readonly mapper: Mapper) {
    }

    async getLogs(txn: TransactionContext, query?: GetLogQueryDTO) {
        return await txn.execute(async queryRunner => {
            const where: FindOptionsWhere<LogEntity> = {}
            if (query?.executor) where.executor = query.executor
            if (query?.type) where.type = query.type

            const logEntries = await queryRunner.manager.find(LogEntity, {
                select: [
                    'id',
                    'executor',
                    'type',
                    'message',
                    'body',
                    'createdAt'
                ],
                where,
            });

            return this.mapper.mapArray(logEntries, LogEntity, GetLogDTO)
        });
    }

    async writeLog(txn: TransactionContext, writeLogDto: WriteLogDTO) {
        return await txn.executeInTransaction(async queryRunner => {
            const validationErrors = await validate(writeLogDto);
            if (validationErrors?.length) {
                throw new BadRequestException(validationErrors);
            }

            const logEntry = queryRunner.manager.create(LogEntity, writeLogDto);
            return await queryRunner.manager.insert(LogEntity, logEntry);
        });
    }
}
