import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeFlockUsecase } from "@/modules/farmora/flock/usecases/tests/factories/flock-usecase.factory";

import { makeFlockBreedUsecase } from "../factories/flock-breed-usecase.factory";
import { TestFlockBreedContext } from "./test-flock-breed.context";

export class TestBuilder {
    private testContext = new TestFlockBreedContext();

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

        this.testContext.flockBreedUsecases = this.testContext.users.map(
            (user) =>
                makeFlockBreedUsecase(
                    user,
                    this.testContext.flockBreedRepository,
                    this.testContext.flockRepository,
                    this.testContext.breedRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            flockBreedUsecases: this.testContext.flockBreedUsecases,

            repositories: {
                user: this.testContext.userRepository,

                membership: this.testContext.membershipRepository,

                flock: this.testContext.flockRepository,

                breed: this.testContext.breedRepository,

                flockBreed: this.testContext.flockBreedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
