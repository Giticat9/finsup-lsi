import { Injectable } from '@nestjs/common';
import { TransactionContext } from 'src/utils/db/transaction';
import { LimitEntity } from './entities/limit.entity';
import * as xlsx from 'xlsx';
import { GetLimitsDTO } from './dto/get-limit.dto';

@Injectable()
export class LimitService {
    async getLimits(txn: TransactionContext): Promise<GetLimitsDTO> {
        return await txn.execute(async queryRunner => {
            const { 0: list, 1: count } = await queryRunner.manager
                .createQueryBuilder(LimitEntity, 'l')
                .select('l.inn')
                .getManyAndCount();

            return {
                count,
                list: list.map(item => item.inn),
            };
        });
    }

    async updateLimits(txn: TransactionContext, buffer: Buffer): Promise<GetLimitsDTO> {
        return await txn.executeInTransaction(async queryRunner => {
            const xlsxLimits = this.parseXlsx(buffer);

            const chunkSize = 200;
            for (let i = 0; i < xlsxLimits.length; i += chunkSize) {
                const chunk = xlsxLimits.slice(i, i + chunkSize);

                const chunkValues = chunk.map<LimitEntity>(inn =>
                    queryRunner.manager.create(LimitEntity, {
                        inn,
                    }),
                );

                await queryRunner.manager
                    .createQueryBuilder()
                    .insert()
                    .into(LimitEntity)
                    .values(chunkValues)
                    .orIgnore()
                    .execute();
            }

            return await this.getLimits(txn);
        });
    }

    private parseXlsx(buffer: Buffer): string[] {
        const workbook = xlsx.read(buffer);

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const values = data.map((row: any) => row[0]);

        return [...new Set<string>(values)];
    }
}
