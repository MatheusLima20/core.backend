import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InventoryItemEntity } from "@/modules/farmora/inventory/entities/inventory-item.entity";
import { InventoryCategory } from "@/modules/farmora/inventory/enums/inventory-category.enum";
import { InventoryUnit } from "@/modules/farmora/inventory/enums/inventory-unit.enum";
import { TransactionEntity } from "@/modules/finance/transaction/entities/transaction.entity";
import { TransactionSourceType } from "@/modules/finance/transaction/enums/transaction-source.type";
import { TransactionType } from "@/modules/finance/transaction-category/enums/transaction.type";
import { isFailure } from "@/shared/result/result.guard";

import { makeLossUsecase } from "../factories/loss-usecase.factory";
import { TestLossContext } from "./test-loss.context";

export class TestBuilder {
    private testContext = new TestLossContext();

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
                uid: "product-uid-1",
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
                uid: "product-uid-2",
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
                uid: "product-uid-3",
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

            new InventoryItemEntity({
                uid: "product-uid-4",
                platformUID: "2",
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
                uid: "product-uid-5",
                platformUID: "2",
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
                uid: "product-uid-6",
                platformUID: "2",
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

    async loadTransactions() {
        const transactions = [
            new TransactionEntity({
                uid: "transaction-uid-1",
                platformUID: "1",
                categoryUID: "category-1",
                type: TransactionType.EXPENSE,
                description: "Compra de milho",
                amount: 500,
                occurredAt: new Date("2026-08-01"),
                source: TransactionSourceType.EGG_SALE,
                sourceUID: "product-uid-1",
                notes: "Compra para alimentação",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),

            new TransactionEntity({
                uid: "transaction-uid-2",
                platformUID: "1",
                categoryUID: "category-2",
                type: TransactionType.EXPENSE,
                description: "Compra de soja",
                amount: 800,
                occurredAt: new Date("2026-08-10"),
                source: TransactionSourceType.LOSS,
                sourceUID: "product-uid-2",
                notes: "Compra de farelo de soja",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),

            new TransactionEntity({
                uid: "transaction-uid-3",
                platformUID: "1",
                categoryUID: "category-1",
                type: TransactionType.INCOME,
                description: "Venda de ovos",
                amount: 1200,
                occurredAt: new Date("2026-08-20"),
                source: TransactionSourceType.MEMBERSHIP,
                sourceUID: "egg-production-1",
                notes: "Venda semanal",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),

            new TransactionEntity({
                uid: "transaction-uid-4",
                platformUID: "2",
                categoryUID: "category-1",
                type: TransactionType.EXPENSE,
                description: "Compra de milho",
                amount: 500,
                occurredAt: new Date("2026-08-01"),
                source: TransactionSourceType.EGG_SALE,
                sourceUID: "product-uid-4",
                notes: "Compra para alimentação",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),

            new TransactionEntity({
                uid: "transaction-uid-5",
                platformUID: "2",
                categoryUID: "category-2",
                type: TransactionType.EXPENSE,
                description: "Compra de soja",
                amount: 800,
                occurredAt: new Date("2026-08-10"),
                source: TransactionSourceType.LOSS,
                sourceUID: "product-uid-5",
                notes: "Compra de farelo de soja",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),

            new TransactionEntity({
                uid: "transaction-uid-6",
                platformUID: "2",
                categoryUID: "category-1",
                type: TransactionType.INCOME,
                description: "Venda de ovos",
                amount: 1200,
                occurredAt: new Date("2026-08-20"),
                source: TransactionSourceType.MEMBERSHIP,
                sourceUID: "egg-production-2",
                notes: "Venda semanal",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "null",
                updatedBy: undefined,
            }),
        ];

        for (const transaction of transactions) {
            const result = await this.testContext.transactionRepository.register(transaction);

            if (isFailure(result)) {
                throw result.error;
            }
        }

        return this;
    }

    createUsecases() {
        this.testContext.usecases = this.testContext.users.map(
            (user) =>
                makeLossUsecase(
                    user,
                    this.testContext.lossRepository,
                    this.testContext.inventoryItemRepository,
                    this.testContext.transactionRepository
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
                loss: this.testContext.lossRepository,
                inventoryItem: this.testContext.inventoryItemRepository,
                transaction: this.testContext.transactionRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
