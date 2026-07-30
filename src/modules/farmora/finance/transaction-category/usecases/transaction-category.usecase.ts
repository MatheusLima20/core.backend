import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import {
    CreateTransactionCategoryDTO,
    CreateTransactionCategoryResponseDTO,
} from "../dtos/create-transaction-category.dto";
import { FindTransactionCategoriesDTO } from "../dtos/find-transaction-category.dto";
import { TransactionCategoryResponseDTO } from "../dtos/transaction-category-response.dto";
import {
    UpdateTransactionCategoryDTO,
    UpdateTransactionCategoryResponseDTO,
} from "../dtos/update-transaction-category.dto";
import { TransactionCategoryEntity } from "../entities/transaction-category.entity";
import { TransactionCategoryAlreadyExistsError } from "../errors/transaction-category-already-exists.error";
import { TransactionCategoryNotFoundError } from "../errors/transaction-category-not-found.error";
import { TransactionCategoryMapper } from "../mappers/transaction-category.mapper";
import { ITransactionCategoryRepository } from "../repositories/transaction-category-repository.interface";

export class TransactionCategoryUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionCategoryRepository: ITransactionCategoryRepository
    ) {}

    async create(
        data: CreateTransactionCategoryDTO
    ): Promise<Result<CreateTransactionCategoryResponseDTO>> {
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

        return ResultMapper.map(created, TransactionCategoryMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<TransactionCategoryResponseDTO>> {
        const result = await this.transactionCategoryRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        const category = ResultMapper.requireData(
            result,
            new TransactionCategoryNotFoundError({ uid })
        );

        return ResultMapper.map(category, TransactionCategoryMapper.toResponseDTO);
    }

    async find(
        filters?: FindTransactionCategoriesDTO
    ): Promise<Result<TransactionCategoryResponseDTO[]>> {
        const result = await this.transactionCategoryRepository.find(
            filters,
            this.context.user.platformUID
        );

        if (!result.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to fetch transaction categories.")
            );
        }

        return ResultMapper.map(result, TransactionCategoryMapper.toResponseDTOList);
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
    ): Promise<Result<TransactionCategoryResponseDTO | null>> {
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
