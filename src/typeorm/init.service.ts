import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeormInitService implements OnModuleInit {
    private readonly devMode: boolean;
    private readonly withMigration: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly dataSource: DataSource,
    ) {
        this.devMode = this.configService.get<boolean>('DB_DEV_MODE') ?? false;
        this.withMigration = this.configService.get<boolean>('DB_MIGRATE') ?? false;
    }

    async onModuleInit() {
        await this.dataSource.initialize();
        await this.renameRequestAppTypeColumn();

        if (this.devMode && this.withMigration) {
            await this.dataSource.synchronize();
            await this.dataSource.runMigrations();
        }
    }

    async renameRequestAppTypeColumn() {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            const columnCheckResult = await queryRunner.query(`
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = 'request' AND column_name = 'app_type_id'
            `);

            if (columnCheckResult.length) return;

            await queryRunner.query(`
                ALTER TABLE "request"
                ADD COLUMN "app_type_id" integer NULL
            `);

            await queryRunner.query(`
                UPDATE "request"
                SET "app_type_id" = "appTypeId"
            `);

            await queryRunner.query(`
                ALTER TABLE "request"
                DROP COLUMN "appTypeId"
            `);
            await queryRunner.query(`
                ALTER TABLE "request"
                ADD CONSTRAINT "FK_app_type_id"
                FOREIGN KEY ("app_type_id") REFERENCES "app_type"("id")
            `);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
