import { MortalityEntity } from "../entities/mortality.entity";
import { MortalityCause } from "../enums/mortality-cause.enum";

export interface FindMortalitiesDTO {
    flockUID?: string;

    mortalityDate?: Date;

    startDate?: Date;
    endDate?: Date;

    cause?: MortalityCause;

    minQuantity?: number;
    maxQuantity?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        MortalityEntity,
        "mortalityDate" | "quantity" | "cause" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
