import { FlockEntity } from "../../flock/entities/flock.entity";
import { ResponseEggProductionDTO } from "../dtos/egg-production-response.dto";

export interface EggProductionWithFlock {
    production: ResponseEggProductionDTO;
    flock: Pick<FlockEntity, "name">;
}
