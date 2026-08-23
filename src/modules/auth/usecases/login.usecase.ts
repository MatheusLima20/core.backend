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
        private readonly hashProvider: IHashProvider,
        private readonly tokenProvider: ITokenProvider
    ) {}

    async execute(email: string, password: string): Promise<Result<LoginResponseDTO>> {
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

        const tokenResult = await this.tokenProvider.generate(user.uid, user.platformUID);

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
