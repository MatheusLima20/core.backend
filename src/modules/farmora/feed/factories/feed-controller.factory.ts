import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";
import { TypeORMTransactionManager } from "@/shared/database/transaction/implementations/typeorm-transaction-manager";

import { FeedController } from "../controllers/feed.controller";
import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";
import { TypeORMFeedRepository } from "../repositories/implementations/type-orm-feed.repository";
import { FeedUsecase } from "../usecases/feed.usecase";

export function makeFeedController(context: RequestContext) {
    const feedRepository = new TypeORMFeedRepository(
        dataSource.getRepository(FeedEntity),
        dataSource.getRepository(FeedItemEntity)
    );

    const transactionManager = new TypeORMTransactionManager(dataSource);

    const usecase = new FeedUsecase(context, transactionManager, feedRepository);

    return new FeedController(usecase);
}
