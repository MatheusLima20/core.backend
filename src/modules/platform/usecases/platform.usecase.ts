import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";
import { AccessDeniedError } from "@/shared/errors/access-denied.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";
import { Slug } from "@/shared/utils/slug/slug";

import { CreatePlatformDTO, CreatePlatformResponseDTO } from "../dto/create-platform.dto";
import { FindPlatformsDTO } from "../dto/find-platform.dto";
import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { UpdatePlatformDTO, UpdatePlatformResponseDTO } from "../dto/update-platform.dto";
import { PlatformEntity } from "../entities/platform.entity";
import { PlatformAlreadyExistsError } from "../errors/platform-already-exists.error";
import { PlatformNotFoundError } from "../errors/platform-not-found.error";
import { PlatformMapper } from "../mappers/platform.mapper";
import { IPlatformRepository } from "../repositories/platform-repository.interface";

export class PlatformUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionManager: ITransactionManager,
        private readonly platformRepository: IPlatformRepository,
        private readonly membershipRepository: IMembershipRepository
    ) {}

    async create(data: CreatePlatformDTO): Promise<Result<CreatePlatformResponseDTO>> {
        return this.transactionManager.execute(async (transaction) => {
            const existingPlatform = await transaction.platformRepository.findByName(data.name);

            if (isFailure(existingPlatform)) {
                return ResultFactory.failure(new PersistenceError("Failed to validate platform."));
            }

            if (existingPlatform.data) {
                return ResultFactory.failure(
                    new PlatformAlreadyExistsError({
                        name: existingPlatform.data.name,
                    })
                );
            }

            const platform = new PlatformEntity({
                slug: Slug.from(data.name),
                isActivated: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: this.context.user.uid,
                updatedBy: null,
                ...data,
            });

            const platformResult = await transaction.platformRepository.register(platform);

            if (isFailure(platformResult)) {
                return ResultFactory.failure(new PersistenceError("Failed to register platform."));
            }

            const membership: MembershipEntity = new MembershipEntity({
                userUID: this.context.user.uid,
                platformUID: platform.uid,
                role: MembershipRole.OWNER,
                createdAt: new Date(),
            });

            const membershipResult = await transaction.membershipRepository.create(membership);

            if (isFailure(membershipResult)) {
                return ResultFactory.failure(
                    new PersistenceError("Failed to create platform owner membership.")
                );
            }

            return ResultMapper.map(platformResult, PlatformMapper.toCreateResponse);
        });
    }

    async findByUID(uid: string): Promise<Result<PlatformResponseDTO | null>> {
        const result = await this.platformRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(result.data);
    }

    async findByName(name: string): Promise<Result<PlatformResponseDTO | null>> {
        const result = await this.platformRepository.findByName(name);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(result.data);
    }

    async find(data?: FindPlatformsDTO): Promise<Result<PaginationResult<PlatformResponseDTO>>> {
        const membershipsResult = await this.membershipRepository.listByUser(this.context.user.uid);

        if (isFailure(membershipsResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch user memberships."));
        }

        const platformUIDs = membershipsResult.data.map((membership) => membership.platformUID);

        const result = await this.platformRepository.find(platformUIDs, data);

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

        const oldPlatform = await this.findByUID(data.uid ?? "");

        if (data.uid !== this.context.user.platformUID) {
            return ResultFactory.failure(new AccessDeniedError());
        }

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
            updatedBy: this.context.user.uid,
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
