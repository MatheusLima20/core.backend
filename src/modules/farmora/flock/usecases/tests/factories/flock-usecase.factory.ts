import { InMemoryFlockBreedRepository } from "@/modules/farmora/flock-breed/repositories/implementations/in-memory-flock-breed.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockRepository } from "../../../repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "../../flock.usecase";

export function makeFlockUsecase(
    user: AuthUser,
    flockRepository: InMemoryFlockRepository,
    flockBreedRepository: InMemoryFlockBreedRepository
) {
    const context = { user };

    return {
        usecase: new FlockUsecase(context, flockRepository, flockBreedRepository),
    };
}
