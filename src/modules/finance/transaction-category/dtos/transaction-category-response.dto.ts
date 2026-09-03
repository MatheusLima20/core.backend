import { TransactionCategoryEntity } from "../entities/transaction-category.entity";

export type TransactionCategoryResponseDTO = Pick<
    TransactionCategoryEntity,
    | "uid"
    | "color"
    | "name"
    | "description"
    | "platformUID"
    | "type"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
