import {LogExecutorEnum, LogLevelEnum} from "../entities/log.entity";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsOptional} from "class-validator";

export class GetLogQueryDTO {
    @ApiProperty({
        required: false,
        enum: LogExecutorEnum
    })
    @IsOptional()
    @IsEnum(LogExecutorEnum)
    executor?: LogExecutorEnum

    @ApiProperty({
        required: false,
        enum: LogLevelEnum
    })
    @IsOptional()
    @IsEnum(LogLevelEnum)
    type?: LogLevelEnum;
}