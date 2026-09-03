import { TransactionCategoryEntity } from "../entities/transaction-category.entity";

export type UpdateTransactionCategoryDTO = Pick<
    TransactionCategoryEntity,
    "uid" | "name" | "description" | "type"
>;

export type UpdateTransactionCategoryResponseDTO = Pick<
    TransactionCategoryEntity,
    "uid" | "name" | "description" | "type" | "updatedBy" | "updatedAt"
>;
