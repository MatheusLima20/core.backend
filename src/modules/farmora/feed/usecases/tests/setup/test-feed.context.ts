import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFeedRepository } from "../../../repositories/implementations/in-memory-feed.repository";
import { FeedUsecase } from "../../feed.usecase";

export class TestFeedContext {
    userRepository = new InMemoryUserRepository();

    feedRepository = new InMemoryFeedRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    feedUsecases: FeedUsecase[] = [];
}
