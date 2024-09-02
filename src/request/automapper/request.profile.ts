import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { RequestEntity } from '../entities/request.entity';
import { RequestDTO } from '../dto/request.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(
                mapper,
                RequestEntity,
                RequestDTO,
                forMember(
                    d => d.appType,
                    mapFrom(s => s.appType.name),
                ),
            );
        };
    }
}
