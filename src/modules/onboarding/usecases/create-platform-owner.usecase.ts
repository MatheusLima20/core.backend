import { IHashProvider } from "@/modules/auth/providers/hash-provider.interface";
import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { PlatformEntity } from "@/modules/platform/entities/platform.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";
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
        private readonly transactionManager: ITransactionManager,
        private readonly hashProvider: IHashProvider
    ) {}

    async execute(data: CreatePlatformOwnerDTO): Promise<Result<CreatePlatformOwnerResponseDTO>> {
        const password = await this.hashProvider.hash(data.owner.password);

        return this.transactionManager.execute(
            async ({ platformRepository, userRepository, membershipRepository }) => {
                const platform: PlatformEntity = new PlatformEntity({
                    name: data.platform.name,
                    category: data.platform.category,
                    slug: Slug.from(data.platform.name),
                    isActivated: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: null,
                    updatedBy: null,
                });

                const platformResult = await platformRepository.register(platform);

                if (isFailure(platformResult)) {
                    return ResultFactory.failure(platformResult.error);
                }

                const owner: UserEntity = new UserEntity({
                    name: data.owner.name,
                    email: data.owner.email,
                    password,
                    docNumberBusiness: data.owner.docNumberBusiness,
                    isActivated: true,
                    docNumberPerson: data.owner.docNumberPerson,
                    gender: data.owner.gender,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const userResult = await userRepository.register(owner);

                if (isFailure(userResult)) {
                    return ResultFactory.failure(userResult.error);
                }

                const membership: MembershipEntity = new MembershipEntity({
                    userUID: userResult.data.uid,
                    platformUID: platformResult.data.uid,
                    role: MembershipRole.OWNER,
                    createdAt: new Date(),
                });

                const membershipResult = await membershipRepository.create(membership);

                if (isFailure(membershipResult)) {
                    return ResultFactory.failure(membershipResult.error);
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
                    },
                });
            }
        );
    }
}
