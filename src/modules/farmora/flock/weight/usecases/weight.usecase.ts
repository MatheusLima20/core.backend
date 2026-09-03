import { RequestContext } from "@/shared/context/request-context";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { FlockStatus } from "../../flock/enums/flock-status.enum";
import { FlockNotFoundError } from "../../flock/errors/flock-not-found.error";
import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import { CreateWeightDTO, CreateWeightResponseDTO } from "../dtos/create-weight.dto";
import { FindWeightsDTO } from "../dtos/find-weights.dto";
import { ResponseWeightDTO } from "../dtos/response-weight.dto";
import { UpdateWeightDTO, UpdateWeightResponseDTO } from "../dtos/update-weight.dto";
import { WeightEntity } from "../entities/weight.entity";
import { WeightErrorCode } from "../enums/weight.error-code.enum";
import { DuplicateWeightError } from "../errors/duplicate-weight.error";
import { InvalidWeightError } from "../errors/invalid-weight.error";
import { WeightNotFoundError } from "../errors/weight-not-found.error";
import { WeightMapper } from "../mappers/weight.mapper";
import { IWeightRepository } from "../repositories/weight-repository.interface";

export class WeightUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly weightRepository: IWeightRepository,
        private readonly flockRepository: IFlockRepository
    ) {}

    async create(data: CreateWeightDTO): Promise<Result<CreateWeightResponseDTO>> {
        const validation = await this.validateWeight(
            data.flockUID,
            data.weighingDate,
            data.averageWeight,
            data.sampleSize
        );

        if (isFailure(validation)) {
            return validation;
        }

        const weight = new WeightEntity({
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: data.createdAt ?? new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.weightRepository.register(weight);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create weight."));
        }

        return ResultMapper.map(created, WeightMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseWeightDTO | null>> {
        const result = await this.weightRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result) || !result.data) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(result.data), WeightMapper.toResponseDTO);
    }

    async find(filters?: FindWeightsDTO): Promise<Result<PaginationResult<ResponseWeightDTO>>> {
        const result = await this.weightRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch weights."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: WeightMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateWeightDTO): Promise<Result<UpdateWeightResponseDTO>> {
        const existing = await this.weightRepository.findByUID(
            this.context.user.platformUID,
            data.uid
        );

        if (isFailure(existing)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch weight."));
        }

        const weight = ResultMapper.requireData(existing, new WeightNotFoundError(data.uid));

        if (isFailure(weight)) {
            return weight;
        }

        const updatedWeight = new WeightEntity({
            ...weight.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const validation = await this.validateWeight(
            updatedWeight.flockUID,
            updatedWeight.weighingDate,
            updatedWeight.averageWeight,
            updatedWeight.sampleSize,
            updatedWeight.uid
        );

        if (isFailure(validation)) {
            return validation;
        }

        const updated = await this.weightRepository.update(updatedWeight);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update weight."));
        }

        return ResultMapper.map(updated, WeightMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing) || existing.data === null) {
            return ResultFactory.failure(new WeightNotFoundError(uid));
        }

        const deleted = await this.weightRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete weight."));
        }

        return ResultFactory.ok();
    }

    private async validateWeight(
        flockUID: string,
        weighingDate: Date,
        averageWeight: number,
        sampleSize?: number,
        uid?: string
    ): Promise<
        Result<
            void,
            FlockNotFoundError | FlockClosedError | DuplicateWeightError | InvalidWeightError
        >
    > {
        const flock = await this.flockRepository.findByUID(this.context.user.platformUID, flockUID);

        const existingFlock = ResultMapper.requireData(
            flock,
            new FlockNotFoundError({
                uid: flockUID,
            })
        );

        if (isFailure(existingFlock)) {
            return existingFlock;
        }

        if (existingFlock.data.status === FlockStatus.CLOSED) {
            return ResultFactory.failure(new FlockClosedError());
        }

        if (averageWeight <= 0) {
            return ResultFactory.failure(
                new InvalidWeightError(WeightErrorCode.INVALID_AVERAGE_WEIGHT)
            );
        }

        if (sampleSize !== undefined && sampleSize <= 0) {
            return ResultFactory.failure(
                new InvalidWeightError(WeightErrorCode.INVALID_SAMPLE_SIZE)
            );
        }

        const duplicated = await this.weightRepository.exists(this.context.user.platformUID, {
            flockUID,
            weighingDate,
            ignoreUID: uid,
        });

        if (isFailure(duplicated)) {
            return duplicated;
        }

        if (duplicated.data) {
            return ResultFactory.failure(
                new DuplicateWeightError({
                    flockUID,
                    weighingDate,
                })
            );
        }

        return ResultFactory.ok();
    }
}
