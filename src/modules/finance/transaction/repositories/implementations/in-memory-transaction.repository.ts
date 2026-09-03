import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindTransactionsDTO } from "../../dtos/find-transaction.dto";
import { TransactionEntity } from "../../entities/transaction.entity";
import { ITransactionRepository } from "../transaction-repository.interface";

export class InMemoryTransactionRepository implements ITransactionRepository {
    private transactions: TransactionEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<TransactionEntity | null>> {
        const transaction =
            this.transactions.find(
                (transaction) => transaction.platformUID === platformUID && transaction.uid === uid
            ) ?? null;

        return ResultFactory.success(transaction);
    }

    async find(
        platformUID: string,
        filters?: FindTransactionsDTO
    ): Promise<Result<PaginationResult<TransactionEntity>>> {
        let transactions = this.transactions.filter(
            (transaction) => transaction.platformUID === platformUID
        );

        if (filters?.description) {
            transactions = transactions.filter((transaction) =>
                transaction.description.toLowerCase().includes(filters.description!.toLowerCase())
            );
        }

        if (filters?.categoryUID) {
            transactions = transactions.filter(
                (transaction) => transaction.categoryUID === filters.categoryUID
            );
        }

        if (filters?.type) {
            transactions = transactions.filter((transaction) => transaction.type === filters.type);
        }

        if (filters?.source) {
            transactions = transactions.filter(
                (transaction) => transaction.source === filters.source
            );
        }

        if (filters?.sourceUID) {
            transactions = transactions.filter(
                (transaction) => transaction.sourceUID === filters.sourceUID
            );
        }

        if (filters?.occurredAtStart) {
            transactions = transactions.filter(
                (transaction) => transaction.occurredAt >= filters.occurredAtStart!
            );
        }

        if (filters?.occurredAtEnd) {
            transactions = transactions.filter(
                (transaction) => transaction.occurredAt <= filters.occurredAtEnd!
            );
        }

        if (filters?.minAmount !== undefined) {
            transactions = transactions.filter(
                (transaction) => transaction.amount >= filters.minAmount!
            );
        }

        if (filters?.maxAmount !== undefined) {
            transactions = transactions.filter(
                (transaction) => transaction.amount <= filters.maxAmount!
            );
        }

        if (filters?.orderBy) {
            transactions.sort((a, b) => {
                const valueA = a[filters.orderBy!];
                const valueB = b[filters.orderBy!];

                if (valueA < valueB) return filters.order === "desc" ? 1 : -1;

                if (valueA > valueB) return filters.order === "desc" ? -1 : 1;

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = transactions.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = transactions.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(transaction: TransactionEntity): Promise<Result<TransactionEntity>> {
        this.transactions.push(transaction);

        return ResultFactory.success(transaction);
    }

    async update(transaction: TransactionEntity): Promise<Result<TransactionEntity>> {
        const index = this.transactions.findIndex((t) => t.uid === transaction.uid);

        this.transactions[index] = transaction;

        return ResultFactory.success(transaction);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.transactions.findIndex((transaction) => transaction.uid === uid);

        if (index !== -1) {
            this.transactions.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
