import { RequestContext } from "@/shared/context/request-context";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FlockStatus } from "../../flock/enums/flock-status.enum";
import { FlockNotFoundError } from "../../flock/errors/flock-not-found.error";
import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import { IFlockBreedRepository } from "../../flock-breed/repositories/flock-breed-repository.interface";
import {
    CreateEggProductionDTO,
    CreateEggProductionResponseDTO,
} from "../dtos/create-egg-production.dto";
import { EggProductionListResponseDTO } from "../dtos/egg-production-list-response.dto";
import { ResponseEggProductionDTO } from "../dtos/egg-production-response.dto";
import { EggProductionSummaryResponseDTO } from "../dtos/egg-production-summary";
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
        private readonly flockRepository: IFlockRepository,
        private readonly flockBreedRepository: IFlockBreedRepository
    ) {}

    async create(data: CreateEggProductionDTO): Promise<Result<CreateEggProductionResponseDTO>> {
        const validation = await this.validateProductionAlreadyRegistered(
            data.flockUID,
            data.breedUID,
            data.productionDate.toISOString().slice(0, 10)
        );

        if (isFailure(validation)) {
            return validation;
        }

        const productionValidation = await this.validateProduction(
            data.flockUID,
            data.breedUID,
            data.totalEggs
        );

        if (isFailure(productionValidation)) {
            return productionValidation;
        }

        const eggProduction = new EggProductionEntity({
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.eggProductionRepository.register(eggProduction);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create egg production."));
        }

        return ResultMapper.map(created, EggProductionMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseEggProductionDTO | null>> {
        const result = await this.eggProductionRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const egg = result.data;

        if (!egg) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(egg), EggProductionMapper.toResponseDTO);
    }

    async find(
        filters?: FindEggProductionsDTO
    ): Promise<Result<PaginationResult<EggProductionListResponseDTO>>> {
        const result = await this.eggProductionRepository.find(
            this.context.user.platformUID,
            filters
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch egg productions."));
        }

        return ResultFactory.success({
            ...result.data,
            data: result.data.data.map((item) => EggProductionMapper.toListResponseDTO(item)),
        });
    }

    async findSummary(): Promise<Result<EggProductionSummaryResponseDTO>> {
        const result = await this.eggProductionRepository.findSummary(
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        return ResultFactory.success(EggProductionMapper.toSummaryResponseDTO(result.data));
    }

    async update(data: UpdateEggProductionDTO): Promise<Result<UpdateEggProductionResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredEgg = ResultMapper.requireData(
            existing,
            new EggProductionNotFoundError({ uid: data.uid })
        );

        if (isFailure(requiredEgg)) {
            return requiredEgg;
        }

        const eggProduction = new EggProductionEntity({
            ...requiredEgg.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const validation = await this.validateProductionAlreadyRegistered(
            eggProduction.flockUID,
            eggProduction.breedUID,
            eggProduction.productionDate.toISOString().slice(0, 10),
            eggProduction.uid
        );

        if (isFailure(validation)) {
            return validation;
        }

        const productionValidation = await this.validateProduction(
            eggProduction.flockUID,
            eggProduction.breedUID,
            eggProduction.totalEggs
        );

        if (isFailure(productionValidation)) {
            return productionValidation;
        }

        const updated = await this.eggProductionRepository.update(eggProduction);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update egg production."));
        }

        return ResultMapper.map(updated, EggProductionMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return existing;
        }

        if (!existing.data) {
            return ResultFactory.failure(new EggProductionNotFoundError({ uid }));
        }

        const deleted = await this.eggProductionRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete egg production."));
        }

        return ResultFactory.ok();
    }

    private async validateProductionAlreadyRegistered(
        flockUID: string,
        breedUID: string,
        productionDate: string,
        uid?: string
    ): Promise<Result<void>> {
        const result = await this.eggProductionRepository.find(this.context.user.platformUID, {
            flockUID,
            breedUID,
            productionDate,
            page: 1,
            limit: 1,
        });

        if (isFailure(result)) {
            return ResultFactory.failure(
                new PersistenceError("Failed to validate egg production.")
            );
        }

        const existing = result.data.data[0];

        if (existing && StringUtil.noEquals(existing.production.uid, uid ?? "")) {
            return ResultFactory.failure(new EggProductionAlreadyRegisteredError());
        }

        return ResultFactory.ok();
    }

    private async validateProduction(
        flockUID: string,
        breedUID: string,
        totalEggs: number
    ): Promise<Result<void, FlockNotFoundError | FlockClosedError | InvalidEggProductionError>> {
        const flock = await this.flockRepository.findByUID(this.context.user.platformUID, flockUID);

        const existing = ResultMapper.requireData(flock, new FlockNotFoundError({ uid: flockUID }));

        if (isFailure(existing)) {
            return ResultFactory.failure(new FlockNotFoundError({ uid: flockUID }));
        }

        if (existing.data.status === FlockStatus.FINISHED) {
            return ResultFactory.failure(new FlockClosedError());
        }

        const flockBreed = await this.flockBreedRepository.findByFlockAndBreed(
            this.context.user.platformUID,
            flockUID,
            breedUID
        );

        if (isFailure(flockBreed)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate flock breed."));
        }

        if (!flockBreed.data) {
            return ResultFactory.failure(new InvalidEggProductionError(totalEggs, 0));
        }

        if (totalEggs > flockBreed.data.quantity) {
            return ResultFactory.failure(
                new InvalidEggProductionError(totalEggs, flockBreed.data.quantity)
            );
        }

        return ResultFactory.ok();
    }
}
