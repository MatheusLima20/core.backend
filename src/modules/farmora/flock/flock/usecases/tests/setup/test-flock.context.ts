import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockRepository } from "../../../repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "../../flock.usecase";

export class TestFlockContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    users: AuthUser[] = [];

    usecases: FlockUsecase[] = [];
}
