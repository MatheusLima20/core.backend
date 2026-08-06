import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";

import { makeWeightUsecase } from "../factory/weight-usecase.factory";
import { TestWeightContext } from "./test-weight.context";

export class TestBuilder {
    private testContext = new TestWeightContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.flockUsecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.testContext.flockRepository).usecase
        );

        this.testContext.weightUsecases = this.testContext.users.map(
            (user) =>
                makeWeightUsecase(
                    user,
                    this.testContext.weightRepository,
                    this.testContext.flockRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            weightUsecases: this.testContext.weightUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.testContext.flockRepository,

                weight: this.testContext.weightRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
