import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFeedRepository } from "../../../repositories/implementations/in-memory-feed.repository";
import { FeedUsecase } from "../../feed.usecase";

export function makeFeedUsecase(user: AuthUser, feedRepository: InMemoryFeedRepository) {
    const context = { user };

    return {
        usecase: new FeedUsecase(context, feedRepository),
    };
}
