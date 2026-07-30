import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { ResultMapper } from "@/shared/result/result.mapper";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FlockStatus } from "../../flock/enums/flock-status.enum";
import { FlockNotFoundError } from "../../flock/errors/flock-not-found.error";
import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import {
    CreateEggProductionDTO,
    CreateEggProductionResponseDTO,
} from "../dtos/create-egg-production.dto";
import { ResponseEggProductionDTO } from "../dtos/egg-production-response.dto";
import { FindEggProductionsDTO } from "../dtos/find-egg-production.dto";
import {
    UpdateEggProductionDTO,
    UpdateEggProductionResponseDTO,
} from "../dtos/update-egg-production.dto";
import { EggProductionEntity } from "../entities/egg-production.entity";
import { EggProductionAlreadyRegisteredError } from "../errors/egg-production-already-registered.error";
import { EggProductionNotFoundError } from "../errors/egg-production-not-found.error";
import { InvalidEggProductionError } from "../errors/invalid-egg-production.error";
import { EggProductionMapper } from "../mappers/egg-production.mapper";
import { IEggProductionRepository } from "../repositories/egg-production-repository.interface";

export class EggProductionUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly eggProductionRepository: IEggProductionRepository,
        private readonly flockRepository: IFlockRepository
    ) {}

    async create(data: CreateEggProductionDTO): Promise<Result<CreateEggProductionResponseDTO>> {
        const validation = await this.validateProductionAlreadyRegistered(
            data.flockUID,
            data.productionDate
        );

        if (!validation.success) {
            return ResultFactory.failure(new EggProductionAlreadyRegisteredError());
        }

        const flockValidation = await this.validateFlock(data.flockUID, data.totalEggs);

        if (!flockValidation.success) {
            return ResultFactory.failure(new FlockNotFoundError({}));
        }

        const productionValidation = await this.validateProductionAlreadyRegistered(
            data.flockUID,
            data.productionDate
        );

        if (!productionValidation.success) {
            return ResultFactory.failure(new EggProductionAlreadyRegisteredError());
        }

        const eggProduction = new EggProductionEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.eggProductionRepository.register(eggProduction);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create egg production."));
        }

        return ResultMapper.map(created, EggProductionMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseEggProductionDTO>> {
        const result = await this.eggProductionRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        const eggProduction = ResultMapper.requireData(
            result,
            new EggProductionNotFoundError({ uid })
        );

        return ResultMapper.map(eggProduction, EggProductionMapper.toResponseDTO);
    }

    async findByFlockAndDate(
        flockUID: string,
        productionDate: Date
    ): Promise<Result<ResponseEggProductionDTO | null>> {
        const result = await this.eggProductionRepository.findByFlockAndDate(
            this.context.user.platformUID,
            flockUID,
            productionDate
        );

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch egg production."));
        }

        const egg = ResultMapper.requireData(result, new EggProductionNotFoundError({}));

        return ResultMapper.map(egg, EggProductionMapper.toResponseDTO);
    }

    async find(filters?: FindEggProductionsDTO): Promise<Result<ResponseEggProductionDTO[]>> {
        const result = await this.eggProductionRepository.find(
            this.context.user.platformUID,
            filters
        );

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch egg productions."));
        }

        return ResultMapper.map(result, EggProductionMapper.toResponseDTOList);
    }

    async update(data: UpdateEggProductionDTO): Promise<Result<UpdateEggProductionResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const eggProduction = new EggProductionEntity({
            ...existing.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const validation = await this.validateProductionAlreadyRegistered(
            eggProduction.flockUID,
            eggProduction.productionDate,
            eggProduction.uid
        );

        if (!validation.success) {
            return ResultFactory.failure(new EggProductionAlreadyRegisteredError());
        }

        const updated = await this.eggProductionRepository.update(eggProduction);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update egg production."));
        }

        return ResultMapper.map(updated, EggProductionMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return ResultFactory.failure(new EggProductionNotFoundError({ uid }));
        }

        const deleted = await this.eggProductionRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete egg production."));
        }

        return ResultFactory.ok();
    }

    private async validateProductionAlreadyRegistered(
        flockUID: string,
        productionDate: Date,
        uid?: string
    ): Promise<Result<void>> {
        const result = await this.eggProductionRepository.findByFlockAndDate(
            this.context.user.platformUID,
            flockUID,
            productionDate
        );

        if (!result.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to validate egg production.")
            );
        }

        if (result.data && StringUtil.noEquals(result.data.uid, uid ?? "")) {
            return ResultFactory.failure(new EggProductionAlreadyRegisteredError());
        }

        return ResultFactory.ok();
    }

    private async validateFlock(flockUID: string, totalEggs: number): Promise<Result<void>> {
        const flock = await this.flockRepository.findByUID(this.context.user.platformUID, flockUID);

        const existing = ResultMapper.requireData(flock, new FlockNotFoundError({ uid: flockUID }));

        if (!existing.success) {
            return ResultFactory.failure(new FlockNotFoundError({ uid: flockUID }));
        }

        if (existing.data.status === FlockStatus.CLOSED) {
            return ResultFactory.failure(new FlockClosedError());
        }

        if (totalEggs > existing.data.quantity) {
            return ResultFactory.failure(
                new InvalidEggProductionError(totalEggs, existing.data.quantity)
            );
        }

        return ResultFactory.ok();
    }
}
