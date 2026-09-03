import { LossEntity } from "../entities/loss.entity";

export type CreateLossDTO = Pick<
    LossEntity,
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
    LossEntity,
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
