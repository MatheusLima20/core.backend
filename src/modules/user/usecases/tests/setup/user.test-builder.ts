import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeUserUsecase } from "../factories/user-usecase.factory";
import { TestUserContext } from "./test-user.context";

export class TestBuilder {
    private testContext = new TestUserContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.userUsecases = this.testContext.users.map(
            (user) => makeUserUsecase(user, this.testContext.userRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            userUsecases: this.testContext.userUsecases,

            repositories: {
                user: this.testContext.userRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
