import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryWeightRepository } from "../../../repositories/implementations/in-memory-weight.repository";
import { WeightUsecase } from "../../weight.usecase";

export class TestWeightContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    weightRepository = new InMemoryWeightRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    flockUsecases: FlockUsecase[] = [];

    weightUsecases: WeightUsecase[] = [];
}
