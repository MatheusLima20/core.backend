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
    | "unitCost"
    | "description"
    | "reason"
    | "createdBy"
>;
