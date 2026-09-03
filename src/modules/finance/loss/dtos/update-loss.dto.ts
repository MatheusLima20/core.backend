import { LossEntity } from "../entities/loss.entity";

export type UpdateLossDTO = Pick<
    LossEntity,
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
    LossEntity,
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
