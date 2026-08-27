import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryContentRepository } from "../../../repositories/implementations/in-memory-content.repository";
import { ContentUsecase } from "../../content.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    contentRepository = new InMemoryContentRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];
    usecases: ContentUsecase[] = [];
}
