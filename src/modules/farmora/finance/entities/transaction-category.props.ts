import { TransactionType } from "../enums/transaction.type";

export interface TransactionCategoryProps {
    uid: string;

    platformUID?: string;

    name: string;

    color?: string;

    type: TransactionType;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
