import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        const columnName = customName ?? propertyName;

        if (embeddedPrefixes?.length) {
            return snakeCase(embeddedPrefixes.join('_')) + '__' + snakeCase(columnName);
        }

        return snakeCase(columnName);
    }
}

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const host = this.configService.get<string>('DB_HOST') ?? 'localhost';
        const port = this.configService.get<number>('DB_PORT') ?? 5432;
        const name = this.configService.get<string>('DB_NAME') ?? 'lsi';
        const username = this.configService.get<string>('DB_USERNAME') ?? 'lsi';
        const password = this.configService.get<string>('DB_PASSWORD') ?? 'lsi-dev-password';

        return {
            type: 'postgres',
            entities: ['dist/**/*.entity.js'],
            host,
            port,
            database: name,
            username,
            password,
            logging: true,
            manualInitialization: true,
            synchronize: false,
            namingStrategy: new SnakeCaseNamingStrategy(),
        };
    }
}
