import { EggProductionProps } from "../entities/egg-production.props";

export type UpdateEggProductionDTO = Pick<EggProductionProps, "uid"> &
    Partial<
        Pick<
            EggProductionProps,
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
    EggProductionProps,
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
