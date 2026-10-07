import { EggProductionEntity } from "../entities/egg-production.entity";

export type UpdateEggProductionDTO = Pick<EggProductionEntity, "uid"> &
    Partial<
        Pick<
            EggProductionEntity,
            | "flockUID"
            | "breedUID"
            | "productionDate"
            | "totalEggs"
            | "crackedEggs"
            | "dirtyEggs"
            | "discardedEggs"
            | "notes"
        >
    >;

export type UpdateEggProductionResponseDTO = Pick<
    EggProductionEntity,
    | "uid"
    | "flockUID"
    | "breedUID"
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
