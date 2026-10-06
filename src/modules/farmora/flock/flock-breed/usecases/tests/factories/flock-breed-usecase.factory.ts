import { InMemoryBreedRepository } from "@/modules/farmora/flock/breed/repositories/implementations/in-memory-breed.repository";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockBreedRepository } from "../../../repositories/implementations/in-memory-flock-breed.repository";
import { FlockBreedUsecase } from "../../flock-breed.usecase";

export function makeFlockBreedUsecase(
    user: AuthUser,
    flockBreedRepository: InMemoryFlockBreedRepository,
    flockRepository: InMemoryFlockRepository,
    breedRepository: InMemoryBreedRepository
) {
    const context = { user };

    return {
        usecase: new FlockBreedUsecase(
            context,
            flockBreedRepository,
            flockRepository,
            breedRepository
        ),
    };
}
