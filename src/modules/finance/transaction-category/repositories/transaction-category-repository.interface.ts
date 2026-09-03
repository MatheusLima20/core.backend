import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindTransactionCategoriesDTO } from "../dtos/find-transaction-category.dto";
import { TransactionCategoryEntity } from "../entities/transaction-category.entity";

export interface ITransactionCategoryRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<TransactionCategoryEntity | null>>;

    find(
        filters?: FindTransactionCategoriesDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<TransactionCategoryEntity>>>;

    register(category: TransactionCategoryEntity): Promise<Result<TransactionCategoryEntity>>;

    update(category: TransactionCategoryEntity): Promise<Result<TransactionCategoryEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
