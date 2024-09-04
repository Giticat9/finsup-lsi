import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "@automapper/classes";

export class GetLogDTO {
    @ApiProperty({name: 'id', description: 'Идентификатор записи'})
    @AutoMap()
    id: number;

    @ApiProperty({name: 'executor', description: 'Инициатор создания записи'})
    @AutoMap()
    executor: string;

    @ApiProperty({name: 'type', description: 'Тип записи'})
    @AutoMap()
    type: string;

    @ApiProperty({name: 'message', description: 'Сообщение записи'})
    @AutoMap()
    message: string;

    @ApiProperty({name: 'body', description: 'Тело записи'})
    @AutoMap()
    body: string;

    @ApiProperty({name: 'createdAt', description: 'Временная метка создания записи'})
    @AutoMap()
    createdAt: string;
}