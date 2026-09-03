import { InventoryItemNotFoundError } from "@/modules/farmora/inventory/errors/inventory-item-not-found.error";
import { IInventoryItemRepository } from "@/modules/farmora/inventory/repositories/inventory-item-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { TransactionNotFoundError } from "../../transaction/errors/transaction-not-found.error";
import { ITransactionRepository } from "../../transaction/repositories/transaction-repository.interface";
import { CreateLossDTO, CreateLossResponseDTO } from "../dtos/create-loss.dto";
import { FindLossesDTO } from "../dtos/find-losses.dto";
import { ResponseLossDTO } from "../dtos/loss-response.dto";
import { UpdateLossDTO, UpdateLossResponseDTO } from "../dtos/update-loss.dto";
import { LossEntity } from "../entities/loss.entity";
import { LossNotFoundError } from "../errors/loss-not-found.error";
import { LossMapper } from "../mappers/loss.mapper";
import { ILossRepository } from "../repositories/loss-repository.interface";

export class LossUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly lossRepository: ILossRepository,
        private readonly inventoryItemRepository: IInventoryItemRepository,
        private readonly transactionRepository: ITransactionRepository
    ) {}

    async create(data: CreateLossDTO): Promise<Result<CreateLossResponseDTO>> {
        const productValidation = await this.validateProduct(data.productUID);

        if (isFailure(productValidation)) {
            return productValidation;
        }

        const transactionValidation = await this.validateTransaction(data.transactionUID);

        if (isFailure(transactionValidation)) {
            return transactionValidation;
        }

        const loss = new LossEntity({
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.lossRepository.register(loss);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create loss."));
        }

        return ResultMapper.map(created, LossMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseLossDTO>> {
        const result = await this.lossRepository.findByUID(this.context.user.platformUID, uid);

        const loss = ResultMapper.requireData(result, new LossNotFoundError({ uid }));

        return ResultMapper.map(loss, LossMapper.toResponseDTO);
    }

    async find(filters?: FindLossesDTO): Promise<Result<PaginationResult<ResponseLossDTO>>> {
        const result = await this.lossRepository.find(this.context.user.platformUID, filters);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch losses."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: LossMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateLossDTO): Promise<Result<UpdateLossResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const productUID = data.productUID ?? existing.data.productUID;

        const transactionUID = data.transactionUID ?? existing.data.transactionUID;

        const productValidation = await this.validateProduct(productUID);

        if (isFailure(productValidation)) {
            return productValidation;
        }

        const transactionValidation = await this.validateTransaction(transactionUID);

        if (isFailure(transactionValidation)) {
            return transactionValidation;
        }

        const loss = new LossEntity({
            ...existing.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.lossRepository.update(loss);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update loss."));
        }

        return ResultMapper.map(updated, LossMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return ResultFactory.failure(new LossNotFoundError({ uid }));
        }

        const deleted = await this.lossRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete loss."));
        }

        return ResultFactory.ok();
    }

    private async validateProduct(uid?: string): Promise<Result<void>> {
        if (!uid) {
            return ResultFactory.ok();
        }

        const result = await this.inventoryItemRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate product."));
        }

        if (!result.data) {
            return ResultFactory.failure(
                new InventoryItemNotFoundError({
                    uid,
                })
            );
        }

        return ResultFactory.ok();
    }

    private async validateTransaction(uid?: string): Promise<Result<void>> {
        if (!uid) {
            return ResultFactory.ok();
        }

        const result = await this.transactionRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate transaction."));
        }

        if (!result.data) {
            return ResultFactory.failure(
                new TransactionNotFoundError({
                    uid,
                })
            );
        }

        return ResultFactory.ok();
    }
}
