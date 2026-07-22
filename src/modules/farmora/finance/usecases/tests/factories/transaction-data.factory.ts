import { CreateTransactionDTO } from "../../../dtos/create-transaction.dto";
import { TransactionSourceType } from "../../../enums/transaction-source.type";
import { TransactionType } from "../../../enums/transaction.type";

function today(): Date {
    return new Date();
}

export const dataTransaction1: CreateTransactionDTO = {
    categoryUID: "category-1",

    type: TransactionType.EXPENSE,

    description: "Purchase of corn",

    source: TransactionSourceType.PURCHASE,
    sourceUID: "purchase-1",

    amount: 250.5,

    occurredAt: today(),

    notes: "First purchase",
};

export const dataTransaction2: CreateTransactionDTO = {
    categoryUID: "category-2",

    type: TransactionType.INCOME,

    description: "Egg sale",

    source: TransactionSourceType.EGG_SALE,
    sourceUID: "sale-1",

    amount: 500,

    occurredAt: today(),

    notes: "Weekly sale",
};

export function makeTransaction(data?: Partial<CreateTransactionDTO>): CreateTransactionDTO {
    return {
        ...dataTransaction1,
        ...data,
    };
}
