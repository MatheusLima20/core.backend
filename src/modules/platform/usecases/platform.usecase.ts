import { randomUUID } from "crypto";

import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";
import { Slug } from "@/shared/utils/slug/slug";

import { CreatePlatformDTO, CreatePlatformResponseDTO } from "../dto/create-platform.dto";
import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { UpdatePlatformDTO, UpdatePlatformResponseDTO } from "../dto/update-platform.dto";
import { PlatformEntity } from "../entities/platform.entities";
import { PlatformAlreadyExistsError } from "../errors/platform-already-exists.error";
import { PlatformNotFoundError } from "../errors/platform-not-found.error";
import { PlatformMapper } from "../mappers/platform.mapper";
import { IPlatformRepository } from "../repositories/platform-repository.interface";

export class PlatformUsecase {
    constructor(private readonly platformRepository: IPlatformRepository) {}

    async create(data: CreatePlatformDTO): Promise<Result<CreatePlatformResponseDTO>> {
        const existingPlatform = await this.platformRepository.findByName(data.name);

        if (isFailure(existingPlatform)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate platform."));
        }

        if (existingPlatform.data) {
            return ResultFactory.failure(
                new PlatformAlreadyExistsError({ name: existingPlatform.data.name })
            );
        }

        const platform = new PlatformEntity({
            uid: randomUUID(),
            slug: Slug.from(data.name),
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedBy: null,
            ...data,
        });

        const result = await this.platformRepository.register(platform);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to register platform."));
        }

        return ResultMapper.map(result, PlatformMapper.toCreateResponse);
    }

    async findByUID(uid: string): Promise<Result<PlatformResponseDTO | null>> {
        const result = await this.platformRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platform."));
        }

        return ResultFactory.success(result.data);
    }

    async findByName(name: string): Promise<Result<PlatformResponseDTO | null>> {
        const result = await this.platformRepository.findByName(name);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platform."));
        }

        return ResultFactory.success(result.data);
    }

    async find(): Promise<Result<PlatformResponseDTO[]>> {
        const result = await this.platformRepository.find();

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platforms."));
        }

        return ResultFactory.success(result.data);
    }

    async update(data: UpdatePlatformDTO): Promise<Result<UpdatePlatformResponseDTO>> {
        const existingPlatform = await this.platformRepository.findByName(data.name ?? "");

        if (isFailure(existingPlatform)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate platform."));
        }

        if (existingPlatform.data && existingPlatform.data.uid !== data.uid) {
            return ResultFactory.failure(new PlatformAlreadyExistsError({ name: data.name }));
        }

        const oldPlatform = await this.findByUID(data.uid);

        if (isFailure(oldPlatform)) {
            return oldPlatform;
        }

        const requiredPlatform = ResultMapper.requireData(
            oldPlatform,
            new PlatformNotFoundError({
                uid: data.uid,
            })
        );

        if (isFailure(requiredPlatform)) {
            return requiredPlatform;
        }

        if (isFailure(requiredPlatform)) {
            return requiredPlatform;
        }

        const mergedPlatform = new PlatformEntity({
            ...requiredPlatform.data,
            ...data,
            updatedBy: data.updatedBy,
            updatedAt: new Date(),
        });

        const result = await this.platformRepository.update(mergedPlatform);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to update platform."));
        }

        return ResultMapper.map(result, PlatformMapper.toUpdateResponse);
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const platform = await this.findByUID(uid);

        if (isFailure(platform)) {
            return platform;
        }

        const requiredPlatform = ResultMapper.requireData(
            platform,
            new PlatformNotFoundError({
                uid: uid,
            })
        );

        if (isFailure(requiredPlatform)) {
            return requiredPlatform;
        }

        const result = await this.platformRepository.delete(uid);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete platform."));
        }

        return ResultFactory.success(result.data);
    }
}
