import { InMemoryBreedRepository } from "@/modules/farmora/breed/repositories/implementations/in-memory-breed.repository";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/usecases/flock.usecase";
import { InMemoryFlockBreedRepository } from "@/modules/farmora/flock-breed/repositories/implementations/in-memory-flock-breed.repository";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryWeightRepository } from "../../../repositories/implementations/in-memory-weight.repository";
import { WeightUsecase } from "../../weight.usecase";

export class TestWeightContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    flockBreedRepository = new InMemoryFlockBreedRepository();

    weightRepository = new InMemoryWeightRepository();

    membershipRepository = new InMemoryMembershipRepository();

    breedRepository = new InMemoryBreedRepository();

    users: AuthUser[] = [];

    flockUsecases: FlockUsecase[] = [];

    weightUsecases: WeightUsecase[] = [];
}
