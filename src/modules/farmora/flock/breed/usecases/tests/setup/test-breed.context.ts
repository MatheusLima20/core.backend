import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryBreedRepository } from "../../../repositories/implementations/in-memory-breed.repository";
import { BreedUsecase } from "../../breed.usecase";

export class TestBreedContext {
    userRepository = new InMemoryUserRepository();

    breedRepository = new InMemoryBreedRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    usecases: BreedUsecase[] = [];
}
