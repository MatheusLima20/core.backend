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
import { CreateMortalityDTO, CreateMortalityResponseDTO } from "../dtos/create-mortality.dto";
import { FindMortalitiesDTO } from "../dtos/find-mortality.dto";
import { ResponseMortalityDTO } from "../dtos/mortality-response-dto";
import { UpdateMortalityDTO, UpdateMortalityResponseDTO } from "../dtos/update-mortality.dto";
import { MortalityEntity } from "../entities/mortality.entity";
import { InvalidMortalityError } from "../errors/invalid-mortality.error";
import { MortalityNotFoundError } from "../errors/mortality-not-found.error";
import { MortalityMapper } from "../mappers/mortality.mapper";
import { IMortalityRepository } from "../repositories/mortality-repository.interface";

export class MortalityUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly mortalityRepository: IMortalityRepository,
        private readonly flockRepository: IFlockRepository
    ) {}

    async create(data: CreateMortalityDTO): Promise<Result<CreateMortalityResponseDTO>> {
        const validation = await this.validateMortality(data.flockUID, data.quantity);

        if (isFailure(validation)) {
            return validation;
        }

        const mortality = new MortalityEntity({
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.mortalityRepository.register(mortality);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create mortality."));
        }

        return ResultMapper.map(created, MortalityMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseMortalityDTO | null>> {
        const result = await this.mortalityRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const mortality = result.data;

        if (!mortality) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(mortality), MortalityMapper.toResponseDTO);
    }

    async find(
        filters?: FindMortalitiesDTO
    ): Promise<Result<PaginationResult<ResponseMortalityDTO>>> {
        const result = await this.mortalityRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch mortalities."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: MortalityMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateMortalityDTO): Promise<Result<UpdateMortalityResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredMortality = ResultMapper.requireData(
            existing,
            new MortalityNotFoundError({ uid: data.uid })
        );

        if (isFailure(requiredMortality)) {
            return requiredMortality;
        }

        const mortality = new MortalityEntity({
            ...requiredMortality.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const validation = await this.validateMortality(mortality.flockUID, mortality.quantity);

        if (isFailure(validation)) {
            return validation;
        }

        const updated = await this.mortalityRepository.update(mortality);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update mortality."));
        }

        return ResultMapper.map(updated, MortalityMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return ResultFactory.failure(new MortalityNotFoundError({ uid }));
        }

        if (existing.data === null) {
            return ResultFactory.failure(new MortalityNotFoundError({ uid }));
        }

        const deleted = await this.mortalityRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete mortality."));
        }

        return ResultFactory.ok();
    }

    private async validateMortality(
        flockUID: string,
        quantity: number
    ): Promise<Result<void, FlockNotFoundError | FlockClosedError | InvalidMortalityError>> {
        const flock = await this.flockRepository.findByUID(this.context.user.platformUID, flockUID);

        const existing = ResultMapper.requireData(flock, new FlockNotFoundError({ uid: flockUID }));

        if (isFailure(existing)) {
            return ResultFactory.failure(new FlockNotFoundError({ uid: flockUID }));
        }

        if (existing.data.status === FlockStatus.CLOSED) {
            return ResultFactory.failure(new FlockClosedError());
        }

        if (quantity > existing.data.quantity) {
            return ResultFactory.failure(
                new InvalidMortalityError(quantity, existing.data.quantity)
            );
        }

        return ResultFactory.ok();
    }
}
