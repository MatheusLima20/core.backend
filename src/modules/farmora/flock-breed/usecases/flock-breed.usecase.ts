import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { BreedNotFoundError } from "../../breed/errors/breed-not-found.error";
import { IBreedRepository } from "../../breed/repositories/breed-repository.interface";
import { FlockNotFoundError } from "../../flock/errors/flock-not-found.error";
import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import { CreateFlockBreedDTO, CreateFlockBreedResponseDTO } from "../dtos/create-flock-breed.dto";
import { FindFlockBreedsDTO } from "../dtos/find-flock-breeds.dto";
import { ResponseFlockBreedDTO } from "../dtos/response-flock-breed.dto";
import { UpdateFlockBreedDTO, UpdateFlockBreedResponseDTO } from "../dtos/update-flock-breed.dto";
import { FlockBreedEntity } from "../entities/flock-breed.entity";
import { FlockBreedAlreadyExistsError } from "../errors/flock-breed-already-exists.error";
import { FlockBreedNotFoundError } from "../errors/flock-breed-not-found.error";
import { InvalidFlockBreedQuantityError } from "../errors/invalid-flock-breed-quantity.error";
import { FlockBreedMapper } from "../mappers/flock-breed.mapper";
import { IFlockBreedRepository } from "../repositories/flock-breed-repository.interface";

export class FlockBreedUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly flockBreedRepository: IFlockBreedRepository,
        private readonly flockRepository: IFlockRepository,
        private readonly breedRepository: IBreedRepository
    ) {}

    async create(data: CreateFlockBreedDTO): Promise<Result<CreateFlockBreedResponseDTO>> {
        const flockResult = await this.flockRepository.findByUID(
            this.context.user.platformUID,
            data.flockUID
        );

        if (isFailure(flockResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate flock."));
        }

        if (!flockResult.data) {
            return ResultFactory.failure(
                new FlockNotFoundError({
                    uid: data.flockUID,
                })
            );
        }

        const breedResult = await this.breedRepository.findByUID(data.breedUID);

        if (isFailure(breedResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate breed."));
        }

        if (!breedResult.data) {
            return ResultFactory.failure(
                new BreedNotFoundError({
                    uid: data.breedUID,
                })
            );
        }

        const duplicated = await this.flockBreedRepository.findByFlockAndBreed(
            this.context.user.platformUID,
            data.flockUID,
            data.breedUID
        );

        if (isFailure(duplicated)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate flock breed."));
        }

        if (duplicated.data) {
            return ResultFactory.failure(new FlockBreedAlreadyExistsError());
        }

        const quantityValidation = this.validateQuantity(data.quantity);

        if (isFailure(quantityValidation)) {
            return quantityValidation;
        }

        const flockBreed = new FlockBreedEntity({
            ...data,

            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: data.createdAt ?? new Date(),
            updatedAt: new Date(),
        });

        const created = await this.flockBreedRepository.register(flockBreed);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create flock breed."));
        }

        return ResultMapper.map(created, FlockBreedMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseFlockBreedDTO | null>> {
        const result = await this.flockBreedRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        if (!result.data) {
            return ResultFactory.success(null);
        }

        const breedResult = await this.breedRepository.findByUID(result.data.breedUID);

        if (isFailure(breedResult)) {
            return ResultFactory.failure(breedResult.error);
        }

        if (!breedResult.data) {
            return ResultFactory.failure(new Error("Breed not found") as never);
        }

        return ResultFactory.success(FlockBreedMapper.toResponseDTO(result.data, breedResult.data));
    }

    async find(
        filters?: FindFlockBreedsDTO
    ): Promise<Result<PaginationResult<ResponseFlockBreedDTO>>> {
        const result = await this.flockBreedRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        const flockBreeds = result.data.data;

        if (flockBreeds.length === 0) {
            return ResultFactory.success({
                ...result.data,
                data: [],
            });
        }

        const uids = [...new Set(flockBreeds.map((item) => item.breedUID))];

        const breedsResult = await this.breedRepository.find({
            uids,
            page: 1,
            limit: uids.length,
        });

        if (isFailure(breedsResult)) {
            return ResultFactory.failure(breedsResult.error);
        }

        const breedsByUID = new Map(breedsResult.data.data.map((breed) => [breed.uid, breed]));

        const data: ResponseFlockBreedDTO[] = [];

        for (const flockBreed of flockBreeds) {
            const breed = breedsByUID.get(flockBreed.breedUID);

            if (!breed) {
                return ResultFactory.failure(
                    new PersistenceError("Failed to fetch an associated breed.")
                );
            }

            data.push(FlockBreedMapper.toResponseDTO(flockBreed, breed));
        }

        return ResultFactory.success({
            ...result.data,
            data,
        });
    }

    async update(data: UpdateFlockBreedDTO): Promise<Result<UpdateFlockBreedResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredFlockBreed = ResultMapper.requireData(
            existing,
            new FlockBreedNotFoundError({
                uid: data.uid,
            })
        );

        if (isFailure(requiredFlockBreed)) {
            return requiredFlockBreed;
        }

        const current = requiredFlockBreed.data;
        const quantity = data.quantity ?? current.quantity;

        const quantityValidation = this.validateQuantity(quantity);

        if (isFailure(quantityValidation)) {
            return quantityValidation;
        }

        const flockBreed = new FlockBreedEntity({
            ...current,
            ...data,

            flockUID: current.flockUID,
            breedUID: current.breedUID,
            quantity,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.flockBreedRepository.update(flockBreed);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update flock breed."));
        }

        return ResultMapper.map(updated, FlockBreedMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return existing;
        }

        if (!existing.data) {
            return ResultFactory.failure(
                new FlockBreedNotFoundError({
                    uid,
                })
            );
        }

        const deleted = await this.flockBreedRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete flock breed."));
        }

        return ResultFactory.ok();
    }

    private validateQuantity(quantity: number): Result<void> {
        if (quantity <= 0) {
            return ResultFactory.failure(
                new InvalidFlockBreedQuantityError(
                    "Flock breed quantity must be greater than zero."
                )
            );
        }

        return ResultFactory.ok();
    }
}
