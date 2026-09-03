import { LossEntity } from "../entities/loss.entity";

export type ResponseLossDTO = Pick<
    LossEntity,
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
