import { LossReason } from "../enums/loss-reason.enum";

export interface LossProps {
    uid?: string;

    platformUID?: string;

    transactionUID?: string;

    productUID?: string;

    quantity: number;

    unitCost: number;

    totalCost: number;

    reason: LossReason;

    description?: string;

    occurredAt: Date;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
