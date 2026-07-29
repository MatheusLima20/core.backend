import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindTransactionsDTO } from "../../dtos/find-transaction.dto";
import { TransactionProps } from "../../entities/transaction.props";
import { ITransactionRepository } from "../transaction-repository.interface";

export class InMemoryTransactionRepository implements ITransactionRepository {
    private transactions: TransactionProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<TransactionProps | null>> {
        const transaction =
            this.transactions.find(
                (transaction) => transaction.platformUID === platformUID && transaction.uid === uid
            ) ?? null;

        return ResultFactory.success(transaction);
    }

    async find(
        platformUID: string,
        filters?: FindTransactionsDTO
    ): Promise<Result<TransactionProps[]>> {
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

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            transactions = transactions.slice(start, end);
        }

        return ResultFactory.success(transactions);
    }

    async register(transaction: TransactionProps): Promise<Result<TransactionProps>> {
        this.transactions.push(transaction);

        return ResultFactory.success(transaction);
    }

    async update(transaction: TransactionProps): Promise<Result<TransactionProps>> {
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
