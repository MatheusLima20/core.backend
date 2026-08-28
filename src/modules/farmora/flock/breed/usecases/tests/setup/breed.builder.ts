import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { InMemoryBreedRepository } from "../../../repositories/implementations/in-memory-breed.repository";
import { BreedUsecase } from "../../breed.usecase";
import { makeBreedUsecase } from "../factories/breed-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();

    private usecases: BreedUsecase[] = [];

    private breedRepository: InMemoryBreedRepository = new InMemoryBreedRepository();

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
        this.usecases = this.testContext.users.map(
            (user) => makeBreedUsecase(user, this.breedRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.usecases,

            repositories: {
                user: this.testContext.userRepository,

                breed: this.breedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
