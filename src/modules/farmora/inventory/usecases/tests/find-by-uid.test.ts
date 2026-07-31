import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { InventoryItemUsecase } from "../inventory-item.usecase";
import { inventoryItem1, makeInventoryItem } from "./factories/inventory-item.factory";
import { setupInventoryItem } from "./setup/inventory-item.setup";
import { scenario } from "./setup/test-builder";

describe("InventoryItemUsecase - findByUID", () => {
    let usecaseUser1!: InventoryItemUsecase;
    let usecaseUser2!: InventoryItemUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            inventoryItemUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find an inventory item by uid", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const found = expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));

        expect(found).toMatchObject({
            uid: inventoryItem.uid,

            name: inventoryItem1.name,

            category: inventoryItem1.category,

            unit: inventoryItem1.unit,

            trackStock: inventoryItem1.trackStock,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecaseUser1.findByUID("invalid-uid"));

        expect(found).toBe(null);
    });

    test("Should not find an inventory item from another platform", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const found = expectSuccess(await usecaseUser2.findByUID(inventoryItem.uid));

        expect(found).toBe(null);
    });

    test("Should return all persisted inventory item data", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const found = expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: inventoryItem.uid,

                name: inventoryItem1.name,

                category: inventoryItem1.category,

                unit: inventoryItem1.unit,

                trackStock: inventoryItem1.trackStock,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return deleted inventory item", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        await usecaseUser1.delete(inventoryItem.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));

        expect(found).toBe(null);
    });
});
