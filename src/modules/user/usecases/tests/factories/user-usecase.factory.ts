import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export function makeUserUsecase(user: AuthUser, userRepository: InMemoryUserRepository) {
    const context = { user };

    return {
        usecase: new UserUseCase(context, userRepository),
    };
}
