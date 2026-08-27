import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makePlatformUsecase } from "../factories/platform-usecase.factory";
import { TestPlatformContext } from "./test-platform.context";

export class TestBuilder {
    private testContext = new TestPlatformContext();

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
        this.testContext.platformUsecases = this.testContext.users.map(
            (user) =>
                makePlatformUsecase(
                    user,
                    this.testContext.transactionManager,
                    this.testContext.platformRepository,
                    this.testContext.membershipRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            platformUsecases: this.testContext.platformUsecases,

            repositories: {
                platform: this.testContext.platformRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
