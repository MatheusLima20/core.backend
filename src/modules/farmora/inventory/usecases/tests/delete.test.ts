import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { InventoryItemNotFoundError } from "../../errors/inventory-item-not-found.error";
import { InventoryItemUsecase } from "../inventory-item.usecase";
import {
    inventoryItem1,
    inventoryItem2,
    inventoryItem3,
    makeInventoryItem,
} from "./factories/inventory-item.factory";
import { setupInventoryItem, setupInventoryItems } from "./setup/inventory-item.setup";
import { scenario } from "./setup/test-builder";

describe("InventoryItemUsecase - delete", () => {
    let usecaseUser1!: InventoryItemUsecase;
    let usecaseUser2!: InventoryItemUsecase;

    beforeEach(async () => {
        ({
            inventoryItemUsecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete an inventory item", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(inventoryItem.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before.data.length).toBe(1);

        expect(after.data.length).toBe(0);

        const found = expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));

        expect(found).toBe(null);
    });

    test("Should delete only selected inventory item", async () => {
        const [itemA, itemB] = await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                ...inventoryItem1,
                name: "Corn",
            }),
            makeInventoryItem({
                ...inventoryItem2,
                name: "Soybean Meal",
            })
        );

        expectSuccess(await usecaseUser1.delete(itemA.uid));

        const deleted = expectSuccess(await usecaseUser1.findByUID(itemA.uid));

        expect(deleted).toBe(null);

        const remaining = expectSuccess(await usecaseUser1.findByUID(itemB.uid));

        expect(remaining?.uid).toBe(itemB.uid);
    });

    test("Should not delete an inexistent inventory item", async () => {
        expectFailure(
            await usecaseUser1.delete("invalid-inventory-item"),
            InventoryItemNotFoundError
        );
    });

    test("Should not delete inventory item from another platform", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        expectFailure(await usecaseUser2.delete(inventoryItem.uid), InventoryItemNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));
    });

    test("Should not delete inventory item from another platform without affecting data", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const user2Items = expectSuccess(await usecaseUser2.find());

        expect(user2Items.data).toHaveLength(0);

        expectFailure(await usecaseUser2.delete(inventoryItem.uid), InventoryItemNotFoundError);

        const user1Items = expectSuccess(await usecaseUser1.find());

        expect(user1Items.data).toHaveLength(1);

        expect(user1Items.data[0].uid).toBe(inventoryItem.uid);
    });

    test("Should delete one inventory item keeping remaining items", async () => {
        const [itemA, itemB, itemC] = await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                ...inventoryItem1,
                name: "Corn",
            }),
            makeInventoryItem({
                ...inventoryItem2,
                name: "Soybean Meal",
            }),
            makeInventoryItem({
                ...inventoryItem3,
                name: "Vitamin Supplement",
            })
        );

        expectSuccess(await usecaseUser1.delete(itemB.uid));

        const items = expectSuccess(await usecaseUser1.find());

        expect(items.data).toHaveLength(2);

        expect(items.data.map((item) => item.uid)).toEqual(
            expect.arrayContaining([itemA.uid, itemC.uid])
        );

        const deleted = expectSuccess(await usecaseUser1.findByUID(itemB.uid));

        expect(deleted).toBe(null);
    });
});
