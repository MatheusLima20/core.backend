import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeBreedUsecase } from "../factories/breed-usecase.factory";
import { TestBreedContext } from "./test-breed.context";

export class TestBuilder {
    private testContext = new TestBreedContext();

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
            (user) => makeBreedUsecase(user, this.testContext.breedRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,

                breed: this.testContext.breedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
