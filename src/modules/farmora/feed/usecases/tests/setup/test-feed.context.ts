import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFeedRepository } from "../../../repositories/implementations/in-memory-feed.repository";
import { FeedUsecase } from "../../feed.usecase";

export class TestFeedContext {
    userRepository = new InMemoryUserRepository();

    feedRepository = new InMemoryFeedRepository();

    users: AuthUser[] = [];

    feedUsecases: FeedUsecase[] = [];
}
