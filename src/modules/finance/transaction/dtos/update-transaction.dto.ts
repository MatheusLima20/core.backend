import { TransactionEntity } from "../entities/transaction.entity";
export type UpdateTransactionDTO = Pick<
    TransactionEntity,
    | "uid"
    | "categoryUID"
    | "description"
    | "type"
    | "amount"
    | "occurredAt"
    | "source"
    | "sourceUID"
    | "notes"
>;

export type UpdateTransactionResponseDTO = Pick<
    TransactionEntity,
    | "uid"
    | "categoryUID"
    | "description"
    | "type"
    | "notes"
    | "amount"
    | "occurredAt"
    | "updatedBy"
    | "updatedAt"
>;
