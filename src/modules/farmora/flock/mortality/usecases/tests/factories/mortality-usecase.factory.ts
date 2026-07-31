import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryMortalityRepository } from "../../../repositories/implementations/in-memory-mortality.repository";
import { MortalityUsecase } from "../../mortality.usecase";

export function makeMortalityUsecase(
    user: AuthUser,
    mortalityRepository: InMemoryMortalityRepository,
    flockRepository: InMemoryFlockRepository
) {
    const context = { user };

    return {
        usecase: new MortalityUsecase(context, mortalityRepository, flockRepository),
    };
}
