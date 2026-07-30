import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
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

        if (!validation.success) {
            return ResultFactory.failure(new BreedAlreadyExistsError(data.name));
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

    async findByUID(uid: string): Promise<Result<ResponseBreedDTO>> {
        const result = await this.breedRepository.findByUID(this.context.user.platformUID, uid);

        const breed = ResultMapper.requireData(result, new BreedNotFoundError({ uid }));

        return ResultMapper.map(breed, BreedMapper.toResponseDTO);
    }

    async findByName(name: string): Promise<Result<ResponseBreedDTO | null>> {
        const result = await this.breedRepository.findByName(this.context.user.platformUID, name);

        const breed = ResultMapper.requireData(result, new BreedNotFoundError({ name }));

        return ResultMapper.map(breed, BreedMapper.toResponseDTO);
    }

    async find(filters?: FindBreedsDTO): Promise<Result<ResponseBreedDTO[]>> {
        const result = await this.breedRepository.find(this.context.user.platformUID, filters);

        return ResultMapper.map(result, BreedMapper.toResponseDTOList);
    }

    async update(data: UpdateBreedDTO): Promise<Result<UpdateBreedResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        if (data.name) {
            const validation = await this.validateBreedAlreadyExists(data.name, data.uid);

            if (!validation.success) {
                return ResultFactory.failure(new BreedAlreadyExistsError(data.name));
            }
        }

        const breed = new BreedEntity({
            ...existing.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.breedRepository.update(breed);

        return ResultMapper.map(updated, BreedMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return ResultFactory.failure(new BreedNotFoundError({ uid }));
        }

        const deleted = await this.breedRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete breed."));
        }

        return ResultFactory.ok();
    }

    private async validateBreedAlreadyExists(name: string, uid?: string): Promise<Result<void>> {
        const result = await this.breedRepository.findByName(
            this.context.user.platformUID,
            name.trim()
        );

        if (!result.success) {
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
