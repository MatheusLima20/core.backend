import { FlockEntity } from "../../flock/entities/flock.entity";
import { EggProductionEntity } from "../entities/egg-production.entity";

export interface EggProductionWithFlock {
    production: EggProductionEntity;
    flock: Pick<FlockEntity, "name">;
}
