import { TransactionCategoryProps } from "../entities/transaction-category.props";

export type UpdateTransactionCategoryDTO = Pick<
    TransactionCategoryProps,
    "uid" | "name" | "description" | "type"
>;

export type UpdateTransactionCategoryResponseDTO = Pick<
    TransactionCategoryProps,
    "uid" | "name" | "description" | "type" | "updatedBy" | "updatedAt"
>;
