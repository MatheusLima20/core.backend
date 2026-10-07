import { EggProductionEntity } from "../entities/egg-production.entity";

export type ResponseEggProductionDTO = Pick<
    EggProductionEntity,
    | "uid"
    | "flockUID"
    | "breedUID"
    | "platformUID"
    | "productionDate"
    | "totalEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "crackedEggs"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
