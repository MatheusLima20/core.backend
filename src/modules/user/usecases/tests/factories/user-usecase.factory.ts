import { IHashProvider } from "@/modules/auth/providers/hash-provider.interface";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export function makeUserUsecase(
    user: AuthUser,
    userRepository: InMemoryUserRepository,
    hashProvider: IHashProvider
) {
    const context = { user };

    return {
        usecase: new UserUseCase(context, userRepository, hashProvider),
    };
}
