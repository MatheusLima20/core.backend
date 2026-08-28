import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { PlatformUsecase } from "../../platform.usecase";
import { makePlatformUsecase } from "../factories/platform-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();
    private platformUsecases: PlatformUsecase[] = [];

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
        this.platformUsecases = this.testContext.users.map(
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
            platformUsecases: this.platformUsecases,

            repositories: {
                platform: this.testContext.platformRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
