import { LossProps } from "../entities/loss.props";
import { LossReason } from "../enums/loss-reason.enum";

export interface FindLossesDTO {
    transactionUID?: string;

    productUID?: string;

    reason?: LossReason;

    occurredAtStart?: Date;
    occurredAtEnd?: Date;

    minQuantity?: number;
    maxQuantity?: number;

    minTotalCost?: number;
    maxTotalCost?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        LossProps,
        "quantity" | "totalCost" | "occurredAt" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
