import { EggProductionEntity } from "../entities/egg-production.entity";

export interface FindEggProductionsDTO {
    flockUID?: string;

    productionDate?: Date;

    startDate?: Date;
    endDate?: Date;

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
