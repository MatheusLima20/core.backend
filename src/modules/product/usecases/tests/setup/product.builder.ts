import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeCategoryUsecase } from "@/modules/category/usecases/tests/factories/category-usecase.factory";

import { makeProductUsecase } from "../factories/product-usecase.factory";
import { TestProductContext } from "./test-product-context";

export class TestBuilder {
    private testContext = new TestProductContext();

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
        this.testContext.categoryUsecases = this.testContext.users.map(
            (user) => makeCategoryUsecase(user, this.testContext.categoryRepository).usecase
        );

        this.testContext.usecases = this.testContext.users.map(
            (user) =>
                makeProductUsecase(
                    user,
                    this.testContext.productRepository,
                    this.testContext.categoryRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            categoryUsecases: this.testContext.categoryUsecases,

            repositories: {
                user: this.testContext.userRepository,

                category: this.testContext.categoryRepository,

                product: this.testContext.productRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
