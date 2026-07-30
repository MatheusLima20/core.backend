import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryEggProductionRepository } from "../../../repositories/implementations/in-memory-egg-production.repository";
import { EggProductionUsecase } from "../../egg-production.usecase";

export class TestEggProductionContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    eggProductionRepository = new InMemoryEggProductionRepository();

    users: AuthUser[] = [];

    flockUsecases: FlockUsecase[] = [];

    eggProductionUsecases: EggProductionUsecase[] = [];
}
