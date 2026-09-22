import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeCategoryUsecase } from "../factories/category-usecase.factory";
import { TestCategoryContext } from "./test-category-context";

export class TestBuilder {
    private testContext = new TestCategoryContext();

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
        this.testContext.usecases = this.testContext.users.map(
            (user) => makeCategoryUsecase(user, this.testContext.categoryRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            repositories: {
                user: this.testContext.userRepository,

                category: this.testContext.categoryRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
