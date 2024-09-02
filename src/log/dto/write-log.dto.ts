import { IsString } from 'class-validator';
import { LogMessageType } from 'typeorm';
import { LogExecutorEnum } from '../entities/log.entity';

export class WriteLogDTO {
    @IsString()
    executor: LogExecutorEnum;

    @IsString()
    type: LogMessageType;

    @IsString()
    message: string;

    @IsString()
    body: string;
}
