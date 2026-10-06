import { EggProductionEntity } from "../entities/egg-production.entity";

export interface FindEggProductionsDTO {
    flockUID?: string;

    productionDate?: string;

    startDate?: string;
    endDate?: string;

    minTotalEggs?: number;
    maxTotalEggs?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        EggProductionEntity,
        | "productionDate"
        | "totalEggs"
        | "crackedEggs"
        | "dirtyEggs"
        | "discardedEggs"
        | "createdAt"
        | "updatedAt"
    >;

    order?: "asc" | "desc";
}
