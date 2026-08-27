import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";

import { makeEggProductionUsecase } from "../factories/egg-production-usecase.factory";
import { TestEggProductionContext } from "./test-egg-production.context";

export class TestBuilder {
    private testContext = new TestEggProductionContext();

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

        this.testContext.eggProductionUsecases = this.testContext.users.map(
            (user) =>
                makeEggProductionUsecase(
                    user,
                    this.testContext.eggProductionRepository,
                    this.testContext.flockRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            eggProductionUsecases: this.testContext.eggProductionUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.testContext.flockRepository,

                eggProduction: this.testContext.eggProductionRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
