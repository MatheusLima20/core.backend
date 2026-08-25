import { CreateTransactionCategoryDTO } from "../../../dtos/create-transaction-category.dto";
import { TransactionType } from "../../../enums/transaction.type";

export const dataTransactionCategory1: CreateTransactionCategoryDTO = {
    name: "Feed",
    type: TransactionType.EXPENSE,
    description: "Feed expenses",
};

export const dataTransactionCategory2: CreateTransactionCategoryDTO = {
    name: "Egg Sale",
    type: TransactionType.INCOME,
    description: "Income from egg sales",
};

export function makeTransactionCategory(
    data?: Partial<CreateTransactionCategoryDTO>
): CreateTransactionCategoryDTO {
    return {
        ...dataTransactionCategory1,
        ...data,
    };
}
