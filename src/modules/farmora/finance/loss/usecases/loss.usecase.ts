import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { ResultMapper } from "@/shared/result/result.mapper";

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
        private readonly lossRepository: ILossRepository
    ) {}

    async create(data: CreateLossDTO): Promise<Result<CreateLossResponseDTO>> {
        const loss = new LossEntity({
            uid: randomUUID(),
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

        return ResultFactory.success(created.data);
    }

    async findByUID(uid: string): Promise<Result<ResponseLossDTO>> {
        const result = await this.lossRepository.findByUID(this.context.user.platformUID, uid);

        if (!result.success || !result.data) {
            return ResultFactory.failure(new LossNotFoundError());
        }

        return ResultFactory.success(result.data);
    }

    async find(filters?: FindLossesDTO): Promise<Result<ResponseLossDTO[]>> {
        const result = await this.lossRepository.find(this.context.user.platformUID, filters);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch losses."));
        }

        return ResultFactory.success(result.data);
    }

    async update(data: UpdateLossDTO): Promise<Result<UpdateLossResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
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

        if (!existing.success) {
            return ResultFactory.failure(new LossNotFoundError());
        }

        const deleted = await this.lossRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete loss."));
        }

        return ResultFactory.ok();
    }
}
