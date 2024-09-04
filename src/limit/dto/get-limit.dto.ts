import {ApiProperty} from "@nestjs/swagger";

/**
 * Модель ответа запроса получения списка ИНН
 */
export class GetLimitsDTO {
    @ApiProperty()
    count: number;

    @ApiProperty()
    list: string[];
}
