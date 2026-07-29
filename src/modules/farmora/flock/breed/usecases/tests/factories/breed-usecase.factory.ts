import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryBreedRepository } from "../../../repositories/implementations/in-memory-breed.repository";
import { BreedUsecase } from "../../breed.usecase";

export function makeBreedUsecase(user: AuthUser, breedRepository: InMemoryBreedRepository) {
    const context = { user };

    return {
        usecase: new BreedUsecase(context, breedRepository),
    };
}
