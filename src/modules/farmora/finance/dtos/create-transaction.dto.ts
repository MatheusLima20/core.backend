import { TransactionProps } from "../entities/transaction.props";

export type CreateTransactionDTO = Pick<
    TransactionProps,
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
    TransactionProps,
    "uid" | "description" | "amount" | "createdBy"
>;
