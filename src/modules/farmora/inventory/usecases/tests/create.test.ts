import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure } from "@/shared/tests/result.helper";

import { InventoryCategory } from "../../enums/inventory-category.enum";
import { InventoryUnit } from "../../enums/inventory-unit.enum";
import { DuplicateInventoryItemError } from "../../errors/duplicate-inventory-item.error";
import { InventoryItemUsecase } from "../inventory-item.usecase";
import { inventoryItem1, makeInventoryItem } from "./factories/inventory-item.factory";
import { setupInventoryItem } from "./setup/inventory-item.setup";
import { scenario } from "./setup/test-builder";

describe("InventoryItemUsecase - create", () => {
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

    test("Should register inventory item", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        expect(inventoryItem).toMatchObject({
            name: inventoryItem1.name,

            category: inventoryItem1.category,

            unit: inventoryItem1.unit,

            trackStock: inventoryItem1.trackStock,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register inventory items in different platforms", async () => {
        const itemUser1 = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const itemUser2 = await setupInventoryItem(usecaseUser2, makeInventoryItem());

        expect(itemUser1.platformUID).toBe(user1.platformUID);

        expect(itemUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same inventory item in different platforms", async () => {
        await setupInventoryItem(usecaseUser1, makeInventoryItem());

        await setupInventoryItem(usecaseUser2, makeInventoryItem());
    });

    test("Should not register duplicated inventory item", async () => {
        await setupInventoryItem(usecaseUser1, makeInventoryItem());

        expectFailure(await usecaseUser1.create(makeInventoryItem()), DuplicateInventoryItemError);
    });

    test("Should allow same name with different category", async () => {
        await setupInventoryItem(usecaseUser1, makeInventoryItem());

        await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                category: InventoryCategory.MEDICINE,
            })
        );
    });

    test("Should allow same name and category with different unit", async () => {
        await setupInventoryItem(usecaseUser1, makeInventoryItem());

        await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                unit: InventoryUnit.LITER,
            })
        );
    });

    test("Should register inventory item without description", async () => {
        const inventoryItem = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                description: undefined,
            })
        );

        expect(inventoryItem.description).toBeUndefined();
    });
});
