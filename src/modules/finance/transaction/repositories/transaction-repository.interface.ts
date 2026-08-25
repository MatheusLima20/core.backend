import { Result } from "@/shared/result";

import { FindTransactionsDTO } from "../dtos/find-transaction.dto";
import { TransactionProps } from "../entities/transaction.props";

export interface ITransactionRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<TransactionProps | null>>;

    find(platformUID: string, filters?: FindTransactionsDTO): Promise<Result<TransactionProps[]>>;

    register(transaction: TransactionProps): Promise<Result<TransactionProps>>;

    update(transaction: TransactionProps): Promise<Result<TransactionProps>>;

    delete(uid: string): Promise<Result<void>>;
}
