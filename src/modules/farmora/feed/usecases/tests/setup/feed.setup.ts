import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateFeedDTO } from "../../../dtos/create-feed.dto";
import { FeedUsecase } from "../../feed.usecase";

export async function setupFeeds(usecase: FeedUsecase, ...feeds: CreateFeedDTO[]) {
    return Promise.all(feeds.map((feed) => createFeedOrFail(usecase, feed)));
}

export async function setupFeed(usecase: FeedUsecase, feed: CreateFeedDTO) {
    return createFeedOrFail(usecase, feed);
}

async function createFeedOrFail(usecase: FeedUsecase, dto: CreateFeedDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateFeedFailure<E extends AppError>(
    usecase: FeedUsecase,
    dto: CreateFeedDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
