import { EntityBase } from 'src/entities/base/EntityBase';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'limit' })
export class LimitEntity extends EntityBase {
    @Column({ name: 'inn', type: 'varchar', length: 255, unique: true })
    inn: string;
}
