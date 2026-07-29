import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeTransactionUsecase } from "../factories/transaction-usecase.factory";
import { TestTransactionContext } from "./test-transaction.context";

export class TestBuilder {
    private testContext = new TestTransactionContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.usecases = this.testContext.users.map(
            (user) => makeTransactionUsecase(user, this.testContext.transactionRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,
                transaction: this.testContext.transactionRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
