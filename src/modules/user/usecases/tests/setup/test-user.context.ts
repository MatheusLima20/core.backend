import { FakeHashProvider } from "@/modules/auth/providers/implementations/fake-hash.provider";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export class TestUserContext {
    userRepository = new InMemoryUserRepository();

    fakeHashProvider = new FakeHashProvider();

    users: AuthUser[] = [];

    userUsecases: UserUseCase[] = [];
}
