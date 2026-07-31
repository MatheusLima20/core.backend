import { MortalityProps } from "../entities/mortality.props";
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
        MortalityProps,
        "mortalityDate" | "quantity" | "cause" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
