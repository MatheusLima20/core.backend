import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";
import { StringUtil } from "@/shared/utils/string/string.util";

import { CreateFlockDTO, CreateFlockResponseDTO } from "../dtos/create-flock.dto";
import { FindFlocksDTO } from "../dtos/find-flock.dto";
import { ResponseFlockDTO } from "../dtos/flock-response.dto";
import { UpdateFlockDTO, UpdateFlockResponseDTO } from "../dtos/update-flock.dto";
import { FlockEntity } from "../entities/flock.entity";
import { FlockStatus } from "../enums/flock-status.enum";
import { FlockAlreadyExistsError } from "../errors/flock-already-exists.error";
import { FlockNotFoundError } from "../errors/flock-not-found.error";
import { FlockMapper } from "../mappers/flock.mapper";
import { IFlockRepository } from "../repositories/flock-repository.interface";

export class FlockUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly flockRepository: IFlockRepository
    ) {}

    async create(data: CreateFlockDTO): Promise<Result<CreateFlockResponseDTO>> {
        const validation = await this.validateFlockAlreadyExists(data.name, data.status);

        if (isFailure(validation)) {
            return validation;
        }

        const flock = new FlockEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: data.createdAt ?? new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.flockRepository.register(flock);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create flock."));
        }

        return ResultMapper.map(created, FlockMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseFlockDTO | null>> {
        const result = await this.flockRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const flock = result.data;

        if (!flock) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(flock), FlockMapper.toResponseDTO);
    }

    async findByName(name: string): Promise<Result<ResponseFlockDTO[]>> {
        const result = await this.flockRepository.findByName(this.context.user.platformUID, name);

        return ResultMapper.map(result, FlockMapper.toResponseDTOList);
    }

    async find(filters?: FindFlocksDTO): Promise<Result<ResponseFlockDTO[]>> {
        const result = await this.flockRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch flocks."));
        }

        return ResultMapper.map(result, FlockMapper.toResponseDTOList);
    }

    async update(data: UpdateFlockDTO): Promise<Result<UpdateFlockResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredFlock = ResultMapper.requireData(
            existing,
            new FlockNotFoundError({ uid: data.uid })
        );

        if (isFailure(requiredFlock)) {
            return requiredFlock;
        }

        const flock = new FlockEntity({
            ...requiredFlock.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        if (data.name) {
            const validation = await this.validateFlockAlreadyExists(
                flock.name,
                flock.status ?? requiredFlock.data.status,
                flock.uid
            );

            if (!validation.success) {
                return ResultFactory.failure(new FlockAlreadyExistsError(data.name));
            }
        }

        const updated = await this.flockRepository.update(flock);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update flock."));
        }

        return ResultMapper.map(updated, FlockMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return existing;
        }

        if (existing.data === null) {
            return ResultFactory.failure(new FlockNotFoundError({ uid }));
        }

        const deleted = await this.flockRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete flock."));
        }

        return ResultFactory.ok();
    }

    private async validateFlockAlreadyExists(
        name: string,
        status: FlockStatus,
        uid?: string
    ): Promise<Result<void>> {
        const result = await this.flockRepository.findByName(this.context.user.platformUID, name);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to validate flock."));
        }

        const duplicated = result.data.some(
            (flock) =>
                StringUtil.noEquals(flock.uid, uid!) &&
                StringUtil.equals(flock.status, FlockStatus.ACTIVE) &&
                StringUtil.equals(status, FlockStatus.ACTIVE)
        );

        if (duplicated) {
            return ResultFactory.failure(new FlockAlreadyExistsError(name));
        }

        return ResultFactory.ok();
    }
}
