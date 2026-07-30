import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryEggProductionRepository } from "../../../repositories/implementations/in-memory-egg-production.repository";
import { EggProductionUsecase } from "../../egg-production.usecase";

export function makeEggProductionUsecase(
    user: AuthUser,
    eggProductionRepository: InMemoryEggProductionRepository,
    flockRepository: InMemoryFlockRepository
) {
    const context = { user };

    return {
        usecase: new EggProductionUsecase(context, eggProductionRepository, flockRepository),
    };
}
