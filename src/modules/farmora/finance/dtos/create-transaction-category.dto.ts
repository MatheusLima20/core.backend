import { TransactionCategoryProps } from "../entities/transaction-category.props";

export type CreateTransactionCategoryDTO = Pick<
    TransactionCategoryProps,
    "name" | "type" | "description"
>;

export type CreateTransactionCategoryResponseDTO = Pick<
    TransactionCategoryProps,
    "uid" | "name" | "createdBy"
>;
