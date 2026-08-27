import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeLossUsecase } from "../factories/loss-usecase.factory";
import { TestLossContext } from "./test-loss.context";

export class TestBuilder {
    private testContext = new TestLossContext();

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
        this.testContext.usecases = this.testContext.users.map(
            (user) => makeLossUsecase(user, this.testContext.lossRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,
                loss: this.testContext.lossRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
