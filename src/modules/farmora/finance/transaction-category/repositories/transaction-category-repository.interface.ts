import { Result } from "@/shared/result";

import { FindTransactionCategoriesDTO } from "../dtos/find-transaction-category.dto";
import { TransactionCategoryProps } from "../entities/transaction-category.props";

export interface ITransactionCategoryRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<TransactionCategoryProps | null>>;

    find(
        filters?: FindTransactionCategoriesDTO,
        platformUID?: string
    ): Promise<Result<TransactionCategoryProps[]>>;

    register(category: TransactionCategoryProps): Promise<Result<TransactionCategoryProps>>;

    update(category: TransactionCategoryProps): Promise<Result<TransactionCategoryProps>>;

    delete(uid: string): Promise<Result<void>>;
}
