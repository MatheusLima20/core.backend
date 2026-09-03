import { TransactionEntity } from "../entities/transaction.entity";

export type ResponseTransactionDTO = Pick<
    TransactionEntity,
    | "uid"
    | "platformUID"
    | "categoryUID"
    | "type"
    | "description"
    | "amount"
    | "occurredAt"
    | "source"
    | "sourceUID"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
