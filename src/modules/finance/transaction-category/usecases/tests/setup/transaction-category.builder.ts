import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeTransactionCategoryUsecase } from "../factories/transaction-category-usecase.factory";
import { TestTransactionCategoryContext } from "./test-transaction-category-context";

export class TestBuilder {
    private testContext = new TestTransactionCategoryContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.usecases = this.testContext.users.map(
            (user) =>
                makeTransactionCategoryUsecase(user, this.testContext.transactionCategoryRepository)
                    .usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,

                transactionCategory: this.testContext.transactionCategoryRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
