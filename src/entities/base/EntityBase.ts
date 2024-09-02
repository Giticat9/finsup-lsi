import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class EntityBase {
    @PrimaryGeneratedColumn()
    public id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}
