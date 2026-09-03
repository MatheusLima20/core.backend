import { TransactionType } from "../../transaction-category/enums/transaction.type";
import { TransactionSourceType } from "../enums/transaction-source.type";

export interface TransactionProps {
    uid?: string;

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
