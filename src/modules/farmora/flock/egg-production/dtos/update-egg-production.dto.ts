import { EggProductionEntity } from "../entities/egg-production.entity";

export type UpdateEggProductionDTO = Pick<EggProductionEntity, "uid"> &
    Partial<
        Pick<
            EggProductionEntity,
            | "flockUID"
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
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
