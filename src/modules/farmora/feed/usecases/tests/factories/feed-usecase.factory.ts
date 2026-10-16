import { InMemoryFlockRepository } from "@/modules/farmora/flock/repositories/implementations/in-memory-flock.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";

import { InMemoryFeedRepository } from "../../../repositories/implementations/in-memory-feed.repository";
import { FeedUsecase } from "../../feed.usecase";

export function makeFeedUsecase(
    user: AuthUser,
    transactionManager: ITransactionManager,
    feedRepository: InMemoryFeedRepository,
    flockRepository: InMemoryFlockRepository
) {
    const context = { user };

    return {
        usecase: new FeedUsecase(context, transactionManager, feedRepository, flockRepository),
    };
}
