import { IUserRepository } from "@/modules/user/repositories/user-repository-interface";

import { LoginResponseDTO } from "../dtos/login-response.dto";
import { IHashProvider } from "../providers/hash-provider.interface";
import { ITokenProvider } from "../providers/token-provider.interface";

export class LoginUsecase {
    constructor(
        private userRepository: IUserRepository,
        private hashProvider: IHashProvider,
        private tokenProvider: ITokenProvider,
    ) {}

    async execute(
        email: string,
        password: string,
    ): Promise<LoginResponseDTO> {

        const user =
            await this.userRepository.findByEmail(
                email,
            );

        if (!user) {
            throw new Error(
                "Invalid credentials.",
            );
        }
        
        const passwordMatch =
            await this.hashProvider.compare(
                password,
                user.password,
            );

        if (!passwordMatch) {
            throw new Error(
                "Invalid credentials.",
            );
        }

        const token =
            await this.tokenProvider.generate(
                user.uid,
                user.platformUID,
            );

        return {
            token,
        };
    }
}