import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindTransactionsDTO } from "../dtos/find-transaction.dto";
import { TransactionEntity } from "../entities/transaction.entity";

export interface ITransactionRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<TransactionEntity | null>>;

    find(
        platformUID: string,
        filters?: FindTransactionsDTO
    ): Promise<Result<PaginationResult<TransactionEntity>>>;

    register(transaction: TransactionEntity): Promise<Result<TransactionEntity>>;

    update(transaction: TransactionEntity): Promise<Result<TransactionEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
