import { EggProductionEntity } from "../entities/egg-production.entity";

export type CreateEggProductionDTO = Pick<
    EggProductionEntity,
    | "flockUID"
    | "breedUID"
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
> &
    Partial<Pick<EggProductionEntity, "createdAt">>;

export type CreateEggProductionResponseDTO = Pick<
    EggProductionEntity,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "breedUID"
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
    | "createdBy"
    | "createdAt"
>;
