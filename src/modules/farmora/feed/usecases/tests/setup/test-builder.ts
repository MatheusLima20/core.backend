import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InventoryItemEntity } from "@/modules/farmora/inventory/entities/inventory-item.entity";
import { InventoryCategory } from "@/modules/farmora/inventory/enums/inventory-category.enum";
import { InventoryUnit } from "@/modules/farmora/inventory/enums/inventory-unit.enum";
import { isFailure } from "@/shared/result/result.guard";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { FeedUsecase } from "../../feed.usecase";
import { makeFeedUsecase } from "../factories/feed-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();

    feedUsecases: FeedUsecase[] = [];

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

    async loadInventoryItems() {
        const inventoryItems = [
            new InventoryItemEntity({
                uid: "inventory-item-1",
                platformUID: "1",
                name: "Milho",
                category: InventoryCategory.FEED,
                unit: InventoryUnit.KG,
                trackStock: true,
                crudeProtein: 8.5,
                metabolizableEnergy: 3300,
                crudeFiber: 2.2,
                calcium: 0.02,
                minimumStock: 100,
                description: "Milho em grão",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new InventoryItemEntity({
                uid: "inventory-item-2",
                platformUID: "1",
                name: "Soja",
                category: InventoryCategory.FEED,
                unit: InventoryUnit.KG,
                trackStock: true,
                crudeProtein: 44,
                metabolizableEnergy: 2250,
                crudeFiber: 5.5,
                calcium: 0.3,
                minimumStock: 100,
                description: "Farelo de soja",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new InventoryItemEntity({
                uid: "inventory-item-3",
                platformUID: "1",
                name: "Farelo de trigo",
                category: InventoryCategory.FEED,
                unit: InventoryUnit.KG,
                trackStock: true,
                crudeProtein: 17,
                metabolizableEnergy: 1700,
                crudeFiber: 10,
                calcium: 0.15,
                minimumStock: 50,
                description: "Farelo de trigo",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ];

        for (const item of inventoryItems) {
            const result = await this.testContext.inventoryItemRepository.register(item);

            if (isFailure(result)) {
                throw result.error;
            }
        }

        return this;
    }

    createUsecases() {
        this.feedUsecases = this.testContext.users.map(
            (user) =>
                makeFeedUsecase(
                    user,
                    this.testContext.transactionManager,
                    this.testContext.feedRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            feedUsecases: this.feedUsecases,

            repositories: {
                feed: this.testContext.feedRepository,
                inventoryItem: this.testContext.inventoryItemRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
