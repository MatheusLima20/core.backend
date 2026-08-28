import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { InMemoryEggProductionRepository } from "../../../repositories/implementations/in-memory-egg-production.repository";
import { EggProductionUsecase } from "../../egg-production.usecase";
import { makeEggProductionUsecase } from "../factories/egg-production-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();
    private flockUsecases: FlockUsecase[] = [];
    private flockRepository: InMemoryFlockRepository = new InMemoryFlockRepository();
    private eggProductionUsecases: EggProductionUsecase[] = [];
    private eggProductionRepository: InMemoryEggProductionRepository =
        new InMemoryEggProductionRepository();

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
        this.flockUsecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.flockRepository).usecase
        );

        this.eggProductionUsecases = this.testContext.users.map(
            (user) =>
                makeEggProductionUsecase(user, this.eggProductionRepository, this.flockRepository)
                    .usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.flockUsecases,

            eggProductionUsecases: this.eggProductionUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.flockRepository,

                eggProduction: this.eggProductionRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
