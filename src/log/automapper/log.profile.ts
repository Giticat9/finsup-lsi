import {AutomapperProfile, InjectMapper} from "@automapper/nestjs";
import {createMap, Mapper, MappingProfile} from "@automapper/core";
import {LogEntity} from "../entities/log.entity";
import {GetLogDTO} from "../dto/get-log.dto";
import {Injectable} from "@nestjs/common";

@Injectable()
export class LogProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    get profile(): MappingProfile {
        return mapper => {
            createMap(mapper, LogEntity, GetLogDTO)
        }
    }
}