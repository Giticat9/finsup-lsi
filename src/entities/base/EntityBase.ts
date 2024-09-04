import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import {AutoMap} from "@automapper/classes";

export abstract class EntityBase {
    @PrimaryGeneratedColumn()
    @AutoMap()
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    @AutoMap()
    createdAt: Date;
}
