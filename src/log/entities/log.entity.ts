import { EntityBase } from 'src/entities/base/EntityBase';
import { Column, Entity } from 'typeorm';
import {AutoMap} from "@automapper/classes";

export enum LogExecutorEnum {
    REQUEST = 'request',
}

export enum LogLevelEnum {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    error = 'error',
}

@Entity({ name: 'log' })
export class LogEntity extends EntityBase {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    executor: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @AutoMap()
    type: string;

    @Column({ type: 'text', nullable: true })
    @AutoMap()
    message: string;

    @Column({ type: 'text', nullable: true })
    @AutoMap()
    body: string;
}
