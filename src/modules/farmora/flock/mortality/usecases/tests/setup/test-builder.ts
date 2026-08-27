import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";

import { makeMortalityUsecase } from "../factories/mortality-usecase.factory";
import { TestMortalityContext } from "./test-mortality.context";

export class TestBuilder {
    private testContext = new TestMortalityContext();

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
        this.testContext.flockUsecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.testContext.flockRepository).usecase
        );

        this.testContext.mortalityUsecases = this.testContext.users.map(
            (user) =>
                makeMortalityUsecase(
                    user,
                    this.testContext.mortalityRepository,
                    this.testContext.flockRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            mortalityUsecases: this.testContext.mortalityUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.testContext.flockRepository,

                mortality: this.testContext.mortalityRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
