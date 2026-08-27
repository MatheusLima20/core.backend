import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryLossRepository } from "../../../repositories/implementations/in-memory-loss.repository";
import { LossUsecase } from "../../loss.usecase";

export class TestLossContext {
    userRepository = new InMemoryUserRepository();

    lossRepository = new InMemoryLossRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    usecases: LossUsecase[] = [];
}
