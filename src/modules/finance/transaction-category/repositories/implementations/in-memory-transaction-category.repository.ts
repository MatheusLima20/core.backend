import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindTransactionCategoriesDTO } from "../../dtos/find-transaction-category.dto";
import { TransactionCategoryProps } from "../../entities/transaction-category.props";
import { ITransactionCategoryRepository } from "../transaction-category-repository.interface";

export class InMemoryTransactionCategoryRepository implements ITransactionCategoryRepository {
    private transactions: TransactionCategoryProps[] = [];

    async findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<TransactionCategoryProps | null>> {
        const transaction =
            this.transactions.find(
                (transaction) => transaction.platformUID === platformUID && transaction.uid === uid
            ) ?? null;

        return ResultFactory.success(transaction);
    }

    async find(
        filters?: FindTransactionCategoriesDTO,
        platformUID?: string
    ): Promise<Result<TransactionCategoryProps[]>> {
        let transactions = this.transactions;

        if (platformUID) {
            transactions = transactions.filter(
                (transaction) => transaction.platformUID === platformUID
            );
        }

        if (filters?.name) {
            transactions = transactions.filter((transaction) =>
                transaction.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.type) {
            transactions = transactions.filter((transaction) => transaction.type === filters.type);
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

    async register(
        transaction: TransactionCategoryProps
    ): Promise<Result<TransactionCategoryProps>> {
        this.transactions.push(transaction);

        return ResultFactory.success(transaction);
    }

    async update(transaction: TransactionCategoryProps): Promise<Result<TransactionCategoryProps>> {
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
