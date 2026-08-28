import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { InMemoryFlockRepository } from "../../../repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "../../flock.usecase";
import { makeFlockUsecase } from "../factories/flock-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();
    private usecases: FlockUsecase[] = [];
    private flockRepository: InMemoryFlockRepository = new InMemoryFlockRepository();

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
            (user) => makeFlockUsecase(user, this.flockRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.usecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.flockRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
