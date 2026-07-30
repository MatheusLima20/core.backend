import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeFlockUsecase } from "../factories/flock-usecase.factory";
import { TestFlockContext } from "./test-flock.context";

export class TestBuilder {
    private testContext = new TestFlockContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.usecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.testContext.flockRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.testContext.flockRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
