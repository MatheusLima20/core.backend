import { TransactionCategoryEntity } from "../entities/transaction-category.entity";

export type CreateTransactionCategoryDTO = Pick<
    TransactionCategoryEntity,
    "name" | "type" | "description"
>;

export type CreateTransactionCategoryResponseDTO = Pick<
    TransactionCategoryEntity,
    "uid" | "name" | "description" | "color" | "platformUID" | "type" | "createdBy" | "createdAt"
>;
