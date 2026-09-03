import { TransactionCategoryEntity } from "../entities/transaction-category.entity";
import { TransactionType } from "../enums/transaction.type";

export interface FindTransactionCategoriesDTO {
    name?: string;

    type?: TransactionType;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<TransactionCategoryEntity, "name" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
