import { LossProps } from "../entities/loss.props";

export type CreateLossDTO = Pick<
    LossProps,
    | "transactionUID"
    | "productUID"
    | "quantity"
    | "unitCost"
    | "totalCost"
    | "reason"
    | "description"
    | "occurredAt"
>;

export type CreateLossResponseDTO = Pick<
    LossProps,
    | "uid"
    | "platformUID"
    | "productUID"
    | "transactionUID"
    | "quantity"
    | "totalCost"
    | "occurredAt"
    | "unitCost"
    | "description"
    | "reason"
    | "createdAt"
    | "createdBy"
>;
