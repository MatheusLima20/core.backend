import { EggProductionProps } from "../entities/egg-production.props";

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
        EggProductionProps,
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
