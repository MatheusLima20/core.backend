import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeInventoryItemUsecase } from "../factories/inventory-item-usecase";
import { TestInventoryItemContext } from "./test-inventory-item.context";

export class TestBuilder {
    private testContext = new TestInventoryItemContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.inventoryItemUsecases = this.testContext.users.map(
            (user) =>
                makeInventoryItemUsecase(user, this.testContext.inventoryItemRepository).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            inventoryItemUsecases: this.testContext.inventoryItemUsecases,

            repositories: {
                user: this.testContext.userRepository,

                inventoryItem: this.testContext.inventoryItemRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
