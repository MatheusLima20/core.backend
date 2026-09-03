import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindTransactionsDTO } from "../../dtos/find-transaction.dto";
import { TransactionEntity } from "../../entities/transaction.entity";
import { ITransactionRepository } from "../transaction-repository.interface";

export class TypeORMTransactionRepository implements ITransactionRepository {
    constructor(private readonly transactionRepository: Repository<TransactionEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<TransactionEntity | null>> {
        const transaction = await this.transactionRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(transaction);
    }

    async find(
        platformUID: string,
        filters?: FindTransactionsDTO
    ): Promise<Result<PaginationResult<TransactionEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.transactionRepository
            .createQueryBuilder("transaction")
            .where("transaction.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.categoryUID) {
            query.andWhere("transaction.categoryUID = :categoryUID", {
                categoryUID: filters.categoryUID,
            });
        }

        if (filters?.type) {
            query.andWhere("transaction.type = :type", {
                type: filters.type,
            });
        }

        if (filters?.source) {
            query.andWhere("transaction.source = :source", {
                source: filters.source,
            });
        }

        if (filters?.sourceUID) {
            query.andWhere("transaction.sourceUID = :sourceUID", {
                sourceUID: filters.sourceUID,
            });
        }

        if (filters?.occurredAtStart) {
            query.andWhere("transaction.occurredAt >= :occurredAtStart", {
                occurredAtStart: filters.occurredAtStart,
            });
        }

        if (filters?.occurredAtEnd) {
            query.andWhere("transaction.occurredAt <= :occurredAtEnd", {
                occurredAtEnd: filters.occurredAtEnd,
            });
        }

        if (filters?.minAmount !== undefined) {
            query.andWhere("transaction.amount >= :minAmount", {
                minAmount: filters.minAmount,
            });
        }

        if (filters?.maxAmount !== undefined) {
            query.andWhere("transaction.amount <= :maxAmount", {
                maxAmount: filters.maxAmount,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `transaction.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(transaction: TransactionEntity): Promise<Result<TransactionEntity>> {
        const savedTransaction = await this.transactionRepository.save(transaction);

        return ResultFactory.success(savedTransaction);
    }

    async update(transaction: TransactionEntity): Promise<Result<TransactionEntity>> {
        const savedTransaction = await this.transactionRepository.save(transaction);

        return ResultFactory.success(savedTransaction);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.transactionRepository.delete(uid);

        return ResultFactory.ok();
    }
}
