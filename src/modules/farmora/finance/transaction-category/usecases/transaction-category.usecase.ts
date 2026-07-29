import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateTransactionCategoryDTO } from "../dtos/create-transaction-category.dto";
import { FindTransactionCategoriesDTO } from "../dtos/find-transaction-category.dto";
import {
    UpdateTransactionCategoryDTO,
    UpdateTransactionCategoryResponseDTO,
} from "../dtos/update-transaction-category.dto";
import { TransactionCategoryEntity } from "../entities/transaction-category.entity";
import { TransactionCategoryProps } from "../entities/transaction-category.props";
import { TransactionCategoryAlreadyExistsError } from "../errors/transaction-category-already-exists.error";
import { TransactionCategoryNotFoundError } from "../errors/transaction-category-not-found.error";
import { TransactionCategoryMapper } from "../mappers/transaction-category.mapper";
import { ITransactionCategoryRepository } from "../repositories/transaction-category-repository.interface";

export class TransactionCategoryUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionCategoryRepository: ITransactionCategoryRepository
    ) {}

    async create(data: CreateTransactionCategoryDTO): Promise<Result<TransactionCategoryProps>> {
        const validation = await this.validateCategoryAlreadyExists(data.name);

        if (!validation.success) {
            return validation;
        }

        const category = new TransactionCategoryEntity({
            uid: randomUUID(),

            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.transactionCategoryRepository.register(category);

        if (!created.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to create transaction category.")
            );
        }

        return ResultFactory.success(created.data);
    }

    async findByUID(uid: string): Promise<Result<TransactionCategoryProps>> {
        const result = await this.transactionCategoryRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (!result.success || !result.data) {
            return ResultFactory.failure(new TransactionCategoryNotFoundError({ uid }));
        }

        return ResultFactory.success(result.data);
    }

    async find(
        filters?: FindTransactionCategoriesDTO
    ): Promise<Result<TransactionCategoryProps[]>> {
        const result = await this.transactionCategoryRepository.find(
            filters,
            this.context.user.platformUID
        );

        if (!result.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to fetch transaction categories.")
            );
        }

        return ResultFactory.success(result.data);
    }

    async update(
        data: UpdateTransactionCategoryDTO
    ): Promise<Result<UpdateTransactionCategoryResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const validation = await this.validateCategoryAlreadyExists(data.name, data.uid);

        if (!validation.success) {
            return validation;
        }

        const category = new TransactionCategoryEntity({
            ...existing.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.transactionCategoryRepository.update(category);

        if (!updated.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to update transaction category.")
            );
        }

        return ResultMapper.map(updated, TransactionCategoryMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return ResultFactory.failure(new TransactionCategoryNotFoundError({ uid }));
        }

        const deleted = await this.transactionCategoryRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to delete transaction category.")
            );
        }

        return ResultFactory.ok();
    }

    private async validateCategoryAlreadyExists(
        name: string,
        uid?: string
    ): Promise<Result<TransactionCategoryProps | null>> {
        const result = await this.transactionCategoryRepository.find(
            {
                name,
            },
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return result;
        }

        const [category] = result.data;

        if (category && category.uid !== uid) {
            return ResultFactory.failure(new TransactionCategoryAlreadyExistsError(name));
        }

        return ResultFactory.success(category);
    }
}
