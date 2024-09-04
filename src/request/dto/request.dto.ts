import {SendRequestDTO} from './send-request.dto';
import {Exclude} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {AutoMap} from "@automapper/classes";

export class RequestDTO extends SendRequestDTO {
    @ApiProperty({name: 'id', description: 'Уникальный идентификатор созданной заявки'})
    @Exclude()
    @AutoMap()
    id?: string;

    @ApiProperty({name: 'appType', description: 'Тип заявки'})
    @Exclude()
    @AutoMap()
    appType: string;

    @ApiProperty({name: 'target', description: 'Цель заявки'})
    @Exclude()
    @AutoMap()
    target: string;

    @ApiProperty({name: 'lastName', description: 'Фамилия'})
    @Exclude()
    @AutoMap()
    lastName: string;

    @ApiProperty({name: 'firstName', description: 'Имя'})
    @Exclude()
    @AutoMap()
    firstName: string;

    @ApiProperty({name: 'phone', description: 'Телефон'})
    @Exclude()
    @AutoMap()
    phone: string;

    @ApiProperty({name: 'email', description: 'Email'})
    @Exclude()
    @AutoMap()
    email: string;

    @ApiProperty({name: 'organizationName', description: 'Название организации'})
    @Exclude()
    @AutoMap()
    organizationName: string;

    @ApiProperty({name: 'companyInn', description: 'ИНН организации'})
    @Exclude()
    @AutoMap()
    companyInn: string;

    @ApiProperty({name: 'period', description: 'Период'})
    @Exclude()
    @AutoMap()
    period: string;

    @ApiProperty({name: 'amount', description: 'Сумма'})
    @AutoMap()
    amount: string;
}

export class ReturnRequestDTO {
    @ApiProperty({name: 'count', type: 'number'})
    count: number;

    @ApiProperty({name: 'rows', isArray: true, type: RequestDTO})
    rows: RequestDTO[]
}