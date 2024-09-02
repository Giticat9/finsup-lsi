import { Column, Entity } from 'typeorm';
import { EntityBase } from './base/EntityBase';

/**
 * Перечисление названий приложений, из которых могут поступать заявки
 * @prop FSAPP - приложение финсупа
 * @prop FZ44 - приложение 44 площадки
 * @prop FZ223 - приложение 223 площадки
 */
export enum AppTypeEnum {
    FSAPP = 'FSAPP',
    FZ44 = 'FZ44',
    FZ223 = 'FZ223',
}

@Entity({ name: 'app_type' })
export class AppTypeEntity extends EntityBase {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;
}
