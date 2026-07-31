import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryMortalityRepository } from "../../../repositories/implementations/in-memory-mortality.repository";
import { MortalityUsecase } from "../../mortality.usecase";

export class TestMortalityContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    mortalityRepository = new InMemoryMortalityRepository();

    users: AuthUser[] = [];

    flockUsecases: FlockUsecase[] = [];

    mortalityUsecases: MortalityUsecase[] = [];
}
