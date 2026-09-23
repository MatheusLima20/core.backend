import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeCategoryUsecase } from "@/modules/category/usecases/tests/factories/category-usecase.factory";
import { makeProductUsecase } from "@/modules/product/usecases/tests/factories/product-usecase.factory";

import { makeStockUsecase } from "../factories/stock-usecase.factory";
import { TestStockContext } from "./test-stock-context";

export class TestBuilder {
    private testContext = new TestStockContext();

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

        this.testContext.productUsecases = this.testContext.users.map(
            (user) =>
                makeProductUsecase(
                    user,
                    this.testContext.productRepository,
                    this.testContext.categoryRepository
                ).usecase
        );

        this.testContext.usecases = this.testContext.users.map(
            (user) =>
                makeStockUsecase(
                    user,
                    this.testContext.stockRepository,
                    this.testContext.productRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            usecases: this.testContext.usecases,

            categoryUsecases: this.testContext.categoryUsecases,

            productUsecases: this.testContext.productUsecases,

            repositories: {
                user: this.testContext.userRepository,

                membership: this.testContext.membershipRepository,

                category: this.testContext.categoryRepository,

                product: this.testContext.productRepository,

                stock: this.testContext.stockRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
