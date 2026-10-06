import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockRepository } from "../../../../flock/repositories/implementations/in-memory-flock.repository";
import { InMemoryWeightRepository } from "../../../repositories/implementations/in-memory-weight.repository";
import { WeightUsecase } from "../../weight.usecase";

export function makeWeightUsecase(
    user: AuthUser,
    weightRepository: InMemoryWeightRepository,
    flockRepository: InMemoryFlockRepository
) {
    const context = { user };

    return {
        usecase: new WeightUsecase(context, weightRepository, flockRepository),
    };
}
