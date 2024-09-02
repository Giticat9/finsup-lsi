import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionContext } from 'src/utils/db/transaction';
import { WriteLogDTO } from './dto/write-log.dto';
import { validate } from 'class-validator';
import { LogEntity, LogExecutorEnum } from './entities/log.entity';

@Injectable()
export class LogService {
    async getLogs(txn: TransactionContext) {
        return await txn.execute(async queryRunner => {
            return await queryRunner.manager.find(LogEntity);
        });
    }

    async getLogsByExecutor(txn: TransactionContext, executor: LogExecutorEnum) {
        return await txn.execute(async queryRunner => {
            return await queryRunner.manager.find(LogEntity, {
                where: {
                    executor: executor,
                },
            });
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
