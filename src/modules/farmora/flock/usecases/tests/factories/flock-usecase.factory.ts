import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockRepository } from "../../../repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "../../flock.usecase";

export function makeFlockUsecase(user: AuthUser, flockRepository: InMemoryFlockRepository) {
    const context = { user };

    return {
        usecase: new FlockUsecase(context, flockRepository),
    };
}
