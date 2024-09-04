import {ApiProperty} from "@nestjs/swagger";
import {LogLevelEnum} from "../../log/entities/log.entity";
import {IsEnum, IsOptional} from "class-validator";

export class GetRequestLogsQuery {
    @ApiProperty({
        required: false,
        enum: LogLevelEnum
    })
    @IsOptional()
    @IsEnum(LogLevelEnum, { each: true })
    type?: LogLevelEnum
}