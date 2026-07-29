import { LossProps } from "../entities/loss.props";

export type ResponseLossDTO = Pick<
    LossProps,
    | "uid"
    | "platformUID"
    | "transactionUID"
    | "productUID"
    | "quantity"
    | "unitCost"
    | "totalCost"
    | "reason"
    | "description"
    | "occurredAt"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
