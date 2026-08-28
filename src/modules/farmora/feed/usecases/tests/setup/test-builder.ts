import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { FeedUsecase } from "../../feed.usecase";
import { makeFeedUsecase } from "../factories/feed-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();

    feedUsecases: FeedUsecase[] = [];

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(
                this.testContext.userRepository,
                this.testContext.membershipRepository,
                uid
            );

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.feedUsecases = this.testContext.users.map(
            (user) =>
                makeFeedUsecase(
                    user,
                    this.testContext.transactionManager,
                    this.testContext.feedRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            feedUsecases: this.feedUsecases,

            repositories: {
                feed: this.testContext.feedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
