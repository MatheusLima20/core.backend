import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeFeedUsecase } from "../factories/feed-usecase.factory";
import { TestFeedContext } from "./test-feed.context";

export class TestBuilder {
    private testContext = new TestFeedContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.feedUsecases = this.testContext.users.map(
            (user) => makeFeedUsecase(user, this.testContext.feedRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            feedUsecases: this.testContext.feedUsecases,

            repositories: {
                feed: this.testContext.feedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
