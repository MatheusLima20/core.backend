import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateTransactionDTO, CreateTransactionResponseDTO } from "../dtos/create-transaction.dto";
import { FindTransactionsDTO } from "../dtos/find-transaction.dto";
import { ResponseTransactionDTO } from "../dtos/transaction-response.dto";
import { UpdateTransactionDTO, UpdateTransactionResponseDTO } from "../dtos/update-transaction.dto";
import { TransactionEntity } from "../entities/transaction.entity";
import { TransactionNotFoundError } from "../errors/transaction-not-found.error";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { ITransactionRepository } from "../repositories/transaction-repository.interface";

export class TransactionUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionRepository: ITransactionRepository
    ) {}

    async create(data: CreateTransactionDTO): Promise<Result<CreateTransactionResponseDTO>> {
        const transaction = new TransactionEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.transactionRepository.register(transaction);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create transaction."));
        }

        return ResultFactory.success(created.data);
    }

    async findByUID(uid: string): Promise<Result<ResponseTransactionDTO>> {
        const result = await this.transactionRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (!result.success || !result.data) {
            return ResultFactory.failure(new TransactionNotFoundError({ uid }));
        }

        return ResultFactory.success(result.data);
    }

    async find(filters?: FindTransactionsDTO): Promise<Result<ResponseTransactionDTO[]>> {
        const result = await this.transactionRepository.find(
            this.context.user.platformUID,
            filters
        );

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch transactions."));
        }

        return ResultFactory.success(result.data);
    }

    async update(data: UpdateTransactionDTO): Promise<Result<UpdateTransactionResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const transaction = new TransactionEntity({
            ...existing.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.transactionRepository.update(transaction);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update transaction."));
        }

        return ResultMapper.map(updated, TransactionMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return existing;
        }

        const deleted = await this.transactionRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete transaction."));
        }

        return ResultFactory.ok();
    }
}
