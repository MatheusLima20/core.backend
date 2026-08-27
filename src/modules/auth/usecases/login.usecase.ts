import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
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
        private readonly hashProvider: IHashProvider,
        private readonly tokenProvider: ITokenProvider
    ) {}

    async execute(
        email: string,
        password: string,
        platformUID: string
    ): Promise<Result<LoginResponseDTO>> {
        const result = await this.userRepository.findByEmail(email);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to find user by email."));
        }

        const user = result.data;

        if (!user) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const passwordMatch = await this.hashProvider.compare(password, user.password);

        if (!passwordMatch) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const resultMembership = await this.membershipRepository.findByUserAndPlatform(
            user.uid,
            platformUID
        );

        if (isFailure(resultMembership)) {
            return resultMembership;
        }

        if (!resultMembership) {
            return ResultFactory.failure(new InvalidCredentialsError());
        }

        const membership = resultMembership.data;

        const tokenResult = await this.tokenProvider.generate({
            uid: user.uid,
            platformUID: membership?.platformUID ?? "",
            membershipUID: membership?.uid ?? "",
            role: membership?.role ?? MembershipRole.ADMIN,
        });

        if (isFailure(tokenResult)) {
            return ResultFactory.failure(
                new PersistenceError("Failed to generate authentication token.")
            );
        }

        return ResultFactory.success({
            token: tokenResult.data,
        });
    }
}
