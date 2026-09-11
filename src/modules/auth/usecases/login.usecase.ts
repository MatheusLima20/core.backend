import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
import { IPlatformRepository } from "@/modules/platform/repositories/platform-repository.interface";
import { IUserRepository } from "@/modules/user/repositories/user-repository-interface";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";

import { LoginResponseDTO } from "../dtos/login-response.dto";
import { InvalidCredentialsError } from "../errors/invalid-credentials.error";
import { IHashProvider } from "../providers/hash-provider.interface";
import { ITokenProvider } from "../providers/token-provider.interface";

export class LoginUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly membershipRepository: IMembershipRepository,
        private readonly platformRepository: IPlatformRepository,
        private readonly hashProvider: IHashProvider,
        private readonly tokenProvider: ITokenProvider
    ) {}

    async execute(email: string, password: string): Promise<Result<LoginResponseDTO>> {
        const userResult = await this.userRepository.findByEmail(email);

        if (isFailure(userResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to find user by email."));
        }

        const user = userResult.data;

        if (!user) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const passwordMatch = await this.hashProvider.compare(password, user.password);

        if (!passwordMatch) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const membershipResult = await this.membershipRepository.listByUser(user.uid);

        if (isFailure(membershipResult)) {
            return membershipResult;
        }

        const memberships = membershipResult.data;

        if (memberships.length === 0) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const platformUIDs = memberships.map((membership) => membership.platformUID);

        const platformsResult = await this.platformRepository.find(platformUIDs);

        if (isFailure(platformsResult)) {
            return platformsResult;
        }

        const platforms: LoginResponseDTO["platforms"] = [];

        for (const platform of platformsResult.data.data) {
            const membership = memberships.find((item) => item.platformUID === platform.uid);

            if (!membership) {
                continue;
            }

            platforms.push({
                uid: platform.uid,
                name: platform.name,
                slug: platform.slug,
                role: membership.role,
            });
        }

        if (platforms.length === 0) {
            return ResultFactory.failure(
                new PersistenceError("No valid platforms found for user.")
            );
        }

        if (platforms.length === 1) {
            const membership = memberships.find((item) => item.platformUID === platforms[0].uid);

            if (!membership) {
                return ResultFactory.failure(new PersistenceError("Membership not found."));
            }

            const tokenResult = await this.tokenProvider.generate({
                uid: user.uid,
                platformUID: membership.platformUID,
                membershipUID: membership.uid,
                role: membership.role,
            });

            if (isFailure(tokenResult)) {
                return ResultFactory.failure(
                    new PersistenceError("Failed to generate authentication token.")
                );
            }

            return ResultFactory.success({
                token: tokenResult.data,
                user: {
                    uid: user.uid,
                    name: user.name,
                    email: user.email,
                },
                platforms,
            });
        }

        return ResultFactory.success({
            token: null,
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
            },
            platforms,
        });
    }
}
