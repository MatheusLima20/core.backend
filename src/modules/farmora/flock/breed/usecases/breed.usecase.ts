import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { ResponseBreedDTO } from "../dtos/breed-response.dto";
import { CreateBreedDTO, CreateBreedResponseDTO } from "../dtos/create-breed.dto";
import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { UpdateBreedDTO, UpdateBreedResponseDTO } from "../dtos/update-breed.dto";
import { BreedEntity } from "../entities/breed.entity";
import { BreedAlreadyExistsError } from "../errors/breed-already-exists.error";
import { BreedNotFoundError } from "../errors/breed-not-found.error";
import { BreedMapper } from "../mappers/breed.mapper";
import { IBreedRepository } from "../repositories/breed-repository.interface";

export class BreedUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly breedRepository: IBreedRepository
    ) {}

    async create(data: CreateBreedDTO): Promise<Result<CreateBreedResponseDTO>> {
        const validation = await this.validateBreedAlreadyExists(data.name);

        if (isFailure(validation)) {
            return validation;
        }

        const breed = new BreedEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.breedRepository.register(breed);

        return ResultMapper.map(created, BreedMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseBreedDTO | null>> {
        const result = await this.breedRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const breed = result.data;

        if (!breed) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(breed), BreedMapper.toResponseDTO);
    }

    async findByName(name: string): Promise<Result<ResponseBreedDTO | null>> {
        const result = await this.breedRepository.findByName(this.context.user.platformUID, name);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        const breed = result.data;

        if (!breed) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(breed), BreedMapper.toResponseDTO);
    }

    async find(filters?: FindBreedsDTO): Promise<Result<ResponseBreedDTO[]>> {
        const result = await this.breedRepository.find(this.context.user.platformUID, filters);

        return ResultMapper.map(result, BreedMapper.toResponseDTOList);
    }

    async update(data: UpdateBreedDTO): Promise<Result<UpdateBreedResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredBreed = ResultMapper.requireData(
            existing,
            new BreedNotFoundError({ uid: data.uid })
        );

        if (isFailure(requiredBreed)) {
            return requiredBreed;
        }

        if (data.name) {
            const validation = await this.validateBreedAlreadyExists(data.name, data.uid);

            if (!validation.success) {
                return ResultFactory.failure(new BreedAlreadyExistsError(data.name));
            }
        }

        const breed = new BreedEntity({
            ...requiredBreed.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.breedRepository.update(breed);

        return ResultMapper.map(updated, BreedMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return existing;
        }

        if (existing.data === null) {
            return ResultFactory.failure(new BreedNotFoundError({ uid }));
        }

        const deleted = await this.breedRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete breed."));
        }

        return ResultFactory.ok();
    }

    private async validateBreedAlreadyExists(name: string, uid?: string): Promise<Result<void>> {
        const result = await this.breedRepository.findByName(
            this.context.user.platformUID,
            name.trim()
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate breed."));
        }

        if (
            result.data &&
            result.data.uid !== uid &&
            result.data.name.trim().toLowerCase() === name.trim().toLowerCase()
        ) {
            return ResultFactory.failure(new BreedAlreadyExistsError(name));
        }

        return ResultFactory.ok();
    }
}
