import { EntityBase } from 'src/entities/base/EntityBase';
import { Column, Entity } from 'typeorm';

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
    executor: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    type: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'text', nullable: true })
    body: string;
}
