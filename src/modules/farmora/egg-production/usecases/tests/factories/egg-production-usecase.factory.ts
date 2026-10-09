import { InMemoryBreedRepository } from "@/modules/farmora/breed/repositories/implementations/in-memory-breed.repository";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/repositories/implementations/in-memory-flock.repository";
import { InMemoryFlockBreedRepository } from "@/modules/farmora/flock-breed/repositories/implementations/in-memory-flock-breed.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryEggProductionRepository } from "../../../repositories/implementations/in-memory-egg-production.repository";
import { EggProductionUsecase } from "../../egg-production.usecase";

export function makeEggProductionUsecase(
    user: AuthUser,
    eggProductionRepository: InMemoryEggProductionRepository,
    flockRepository: InMemoryFlockRepository,
    flockBreedRepository: InMemoryFlockBreedRepository,
    breedRepository: InMemoryBreedRepository
) {
    const context = { user };

    return {
        usecase: new EggProductionUsecase(
            context,
            eggProductionRepository,
            flockRepository,
            flockBreedRepository,
            breedRepository
        ),
    };
}
