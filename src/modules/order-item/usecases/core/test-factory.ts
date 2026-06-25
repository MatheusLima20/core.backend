import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeOrderItemUsecase } from "../factories/order-usecase.factory";
import { TestContext } from "./test-context";

export class TestBuilder {
    private testContext = new TestContext();

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
                makeOrderItemUsecase(
                    user,
                    this.testContext.orderItemRepository,
                    this.testContext.orderRepository
                ).usecase
        );
        return this;
    }

    build() {
        return {
            users: this.testContext.users,
            usecases: this.testContext.usecases,
            repositories: {
                user: this.testContext.userRepository,
                order: this.testContext.orderItemRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
