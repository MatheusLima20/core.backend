import { TransactionEntity } from "../entities/transaction.entity";

export type CreateTransactionDTO = Pick<
    TransactionEntity,
    | "categoryUID"
    | "type"
    | "description"
    | "amount"
    | "occurredAt"
    | "source"
    | "sourceUID"
    | "notes"
>;

export type CreateTransactionResponseDTO = Pick<
    TransactionEntity,
    | "uid"
    | "platformUID"
    | "categoryUID"
    | "description"
    | "occurredAt"
    | "type"
    | "source"
    | "notes"
    | "sourceUID"
    | "amount"
    | "createdBy"
    | "createdAt"
>;
