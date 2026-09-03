import { TransactionType } from "../../transaction-category/enums/transaction.type";
import { TransactionEntity } from "../entities/transaction.entity";

export interface FindTransactionsDTO {
    description?: string;

    categoryUID?: string;

    type?: TransactionType;

    source?: string;
    sourceUID?: string;

    occurredAtStart?: Date;
    occurredAtEnd?: Date;

    minAmount?: number;
    maxAmount?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        TransactionEntity,
        "description" | "amount" | "occurredAt" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
