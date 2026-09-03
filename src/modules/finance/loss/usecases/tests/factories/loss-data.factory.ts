import { CreateLossDTO } from "../../../dtos/create-loss.dto";
import { LossReason } from "../../../enums/loss-reason.enum";

export const dataLoss1: CreateLossDTO = {
    productUID: "product-uid-1",
    transactionUID: "transaction-uid-1",
    quantity: 10,
    unitCost: 1.2,
    totalCost: 12,
    reason: LossReason.BROKEN_EGGS,
    description: "Broken eggs during collection",
    occurredAt: new Date("2026-01-10"),
};

export const dataLoss2: CreateLossDTO = {
    productUID: "product-uid-2",
    transactionUID: "transaction-uid-2",
    quantity: 50,
    unitCost: 2,
    totalCost: 100,
    reason: LossReason.FEED_WASTE,
    description: "Feed spoiled by rain",
    occurredAt: new Date("2026-02-10"),
};

export const dataLossPlatform2: CreateLossDTO = {
    productUID: "product-uid-4",
    transactionUID: "transaction-uid-4",
    quantity: 50,
    unitCost: 2,
    totalCost: 100,
    reason: LossReason.FEED_WASTE,
    description: "Feed spoiled by rain",
    occurredAt: new Date("2026-02-10"),
};

export function makeLoss(data?: Partial<CreateLossDTO>): CreateLossDTO {
    return {
        ...dataLoss1,
        ...data,
    };
}
