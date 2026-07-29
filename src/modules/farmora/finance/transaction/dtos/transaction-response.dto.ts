import { TransactionProps } from "../entities/transaction.props";

export type ResponseTransactionDTO = Pick<
    TransactionProps,
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
