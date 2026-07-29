import { TransactionCategoryProps } from "../entities/transaction-category.props";
import { TransactionType } from "../enums/transaction.type";

export interface FindTransactionCategoriesDTO {
    name?: string;

    type?: TransactionType;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<TransactionCategoryProps, "name" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
