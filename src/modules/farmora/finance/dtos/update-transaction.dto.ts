import { TransactionProps } from "../entities/transaction.props";

export type UpdateTransactionDTO = Pick<
    TransactionProps,
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
    TransactionProps,
    | "uid"
    | "categoryUID"
    | "description"
    | "notes"
    | "amount"
    | "occurredAt"
    | "updatedBy"
    | "updatedAt"
>;
