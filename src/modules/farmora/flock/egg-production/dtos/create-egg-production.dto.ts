import { EggProductionProps } from "../entities/egg-production.props";

export type CreateEggProductionDTO = Pick<
    EggProductionProps,
    | "flockUID"
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
> &
    Partial<Pick<EggProductionProps, "createdAt">>;

export type CreateEggProductionResponseDTO = Pick<
    EggProductionProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "productionDate"
    | "totalEggs"
    | "crackedEggs"
    | "dirtyEggs"
    | "discardedEggs"
    | "notes"
    | "createdBy"
    | "createdAt"
>;
