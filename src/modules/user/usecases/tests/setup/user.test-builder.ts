import { FakeHashProvider } from "@/modules/auth/providers/implementations/fake-hash.provider";
import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { UserUseCase } from "../../user.usecase";
import { makeUserUsecase } from "../factories/user-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();

    private userUsecases: UserUseCase[] = [];
    private fakeHashProvider = new FakeHashProvider();

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
        this.userUsecases = this.testContext.users.map(
            (user) =>
                makeUserUsecase(
                    user,
                    this.testContext.userRepository,
                    this.testContext.transactionManager,
                    this.testContext.membershipRepository,
                    this.fakeHashProvider
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            userUsecases: this.userUsecases,

            repositories: {
                user: this.testContext.userRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
