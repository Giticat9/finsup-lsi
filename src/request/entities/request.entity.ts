import { AutoMap } from '@automapper/classes';
import { AppTypeEntity } from 'src/entities/AppType.entity';
import { EntityBase } from 'src/entities/base/EntityBase';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'request' })
export class RequestEntity extends EntityBase {
    @AutoMap()
    @Column({ type: 'varchar', length: 255, nullable: true })
    target: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    lastName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    firstName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    organizationName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    companyInn: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    period: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @AutoMap()
    amount: string;

    @ManyToOne(() => AppTypeEntity)
    @AutoMap()
    appType: AppTypeEntity;
}
