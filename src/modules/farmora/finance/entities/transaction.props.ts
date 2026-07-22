import { TransactionSourceType } from "../enums/transaction-source.type";
import { TransactionType } from "../enums/transaction.type";

export interface TransactionProps {
    uid: string;

    platformUID: string;

    categoryUID: string;

    type: TransactionType;

    description: string;

    source?: TransactionSourceType;

    sourceUID?: string;

    amount: number;

    occurredAt: Date;

    notes?: string;

    createdBy: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
