import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export class TransactionContext {
    private inTransaction: boolean;
    private queryRunner?: QueryRunner;

    dataSource!: DataSource;

    constructor() {
        this.inTransaction = false;
    }

    async execute<T>(callback: (queryRunner: QueryRunner, txn: TransactionContext) => Promise<T>) {
        if (this.queryRunner) {
            return await callback(this.queryRunner, this);
        }
        this.queryRunner = this.dataSource.createQueryRunner();

        try {
            await this.queryRunner.connect();
            return await callback(this.queryRunner, this);
        } finally {
            await this.queryRunner.release();
            this.queryRunner = undefined;
        }
    }

    async executeInTransaction<T>(
        callback: (queryRunner: QueryRunner, txn: TransactionContext) => Promise<T>,
    ) {
        return await this.execute(async (queryRunner: QueryRunner) => {
            if (this.inTransaction) {
                return await callback(this.queryRunner!, this);
            }

            try {
                await queryRunner.startTransaction();
                this.inTransaction = true;

                const result = await callback(queryRunner, this);
                await queryRunner.commitTransaction();

                return result;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                this.inTransaction = false;
            }
        });
    }
}
