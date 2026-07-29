import { LossProps } from "../entities/loss.props";

export type UpdateLossDTO = Pick<
    LossProps,
    | "uid"
    | "transactionUID"
    | "productUID"
    | "quantity"
    | "unitCost"
    | "totalCost"
    | "reason"
    | "description"
    | "occurredAt"
>;

export type UpdateLossResponseDTO = Pick<
    LossProps,
    | "uid"
    | "transactionUID"
    | "productUID"
    | "quantity"
    | "unitCost"
    | "description"
    | "reason"
    | "occurredAt"
    | "totalCost"
    | "updatedBy"
    | "updatedAt"
>;
