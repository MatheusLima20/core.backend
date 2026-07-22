import { TransactionProps } from "../entities/transaction.props";
import { TransactionType } from "../enums/transaction.type";

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
        TransactionProps,
        "description" | "amount" | "occurredAt" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
