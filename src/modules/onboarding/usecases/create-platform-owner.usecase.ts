import { randomUUID } from "crypto";

import { IHashProvider } from "@/modules/auth/providers/hash-provider.interface";
import { PlatformProps } from "@/modules/platform/entities/platform.props";
import { IPlatformRepository } from "@/modules/platform/repositories/platform-repository.interface";
import { UserProps } from "@/modules/user/entities/user.props";
import { UserType } from "@/modules/user/enum/user-type.enum";
import { IUserRepository } from "@/modules/user/repositories/user-repository-interface";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { Slug } from "@/shared/utils/slug/slug";

import {
    CreatePlatformOwnerDTO,
    CreatePlatformOwnerResponseDTO,
} from "../dtos/create-platform-owner.dto";

export class CreatePlatformOwnerUseCase {
    constructor(
        private readonly platformRepository: IPlatformRepository,
        private readonly userRepository: IUserRepository,
        private readonly hashProvider: IHashProvider
    ) {}

    async execute(data: CreatePlatformOwnerDTO): Promise<Result<CreatePlatformOwnerResponseDTO>> {
        const platform: PlatformProps = {
            uid: crypto.randomUUID(),
            name: data.platform.name,
            category: data.platform.category,
            slug: Slug.from(data.platform.name),
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: null,
            updatedBy: null,
        };

        const platformResult = await this.platformRepository.register(platform);

        if (isFailure(platformResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to create platform."));
        }

        const password = await this.hashProvider.hash(data.owner.password);

        const owner: UserProps = {
            uid: randomUUID(),
            name: data.owner.name,
            email: data.owner.email,
            password,
            docNumberBusiness: data.owner.docNumberBusiness,
            docNumberPerson: data.owner.docNumberPerson,
            gender: data.owner.gender,
            userType: UserType.OWNER,
            platformUID: platform.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const userResult = await this.userRepository.register(owner);

        if (isFailure(userResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to create platform owner."));
        }

        return ResultFactory.success({
            platform: {
                uid: platform.uid,
                name: platform.name,
                category: platform.category,
            },
            owner: {
                uid: owner.uid,
                name: owner.name,
                email: owner.email,
                userType: owner.userType,
                platformUID: owner.platformUID,
            },
        });
    }
}
