import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export class TestUserContext {
    userRepository = new InMemoryUserRepository();

    users: AuthUser[] = [];

    userUsecases: UserUseCase[] = [];
}
