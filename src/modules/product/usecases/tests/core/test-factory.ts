import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeProductUsecase } from "@/modules/product/usecases/tests/factories/product-usecase.factory";

import { TestContext } from "./test-context";

export class TestBuilder {
    private testContext = new TestContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(
                this.testContext.userRepository,
                uid,
            );
            this.testContext.users.push(user);
        }
        return this;
    }

    createUsecases() {
        this.testContext.usecases = this.testContext.users.map(
            (user) =>
                makeProductUsecase(user, this.testContext.productRepository)
                    .usecase,
        );
        return this;
    }

    build() {
        return {
            users: this.testContext.users,
            usecases: this.testContext.usecases,
            repositories: {
                user: this.testContext.userRepository,
                product: this.testContext.productRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
