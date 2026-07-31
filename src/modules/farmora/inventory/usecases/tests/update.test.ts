import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateInventoryItemDTO } from "../../dtos/update-inventory-item.dto";
import { InventoryCategory } from "../../enums/inventory-category.enum";
import { InventoryUnit } from "../../enums/inventory-unit.enum";
import { DuplicateInventoryItemError } from "../../errors/duplicate-inventory-item.error";
import { InventoryItemNotFoundError } from "../../errors/inventory-item-not-found.error";
import { InventoryItemUsecase } from "../inventory-item.usecase";
import { makeInventoryItem } from "./factories/inventory-item.factory";
import { setupInventoryItem } from "./setup/inventory-item.setup";
import { scenario } from "./setup/test-builder";

describe("InventoryItemUsecase - update", () => {
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

    test("Should update an inventory item", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const data: UpdateInventoryItemDTO = {
            uid: inventoryItem.uid,
            name: "Updated Item",
            description: "Updated description",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: inventoryItem.uid,

            name: data.name,

            description: data.description,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(inventoryItem.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only name", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: inventoryItem.uid,
                name: "New Name",
            })
        );

        expect(updated.name).toBe("New Name");
    });

    test("Should update only category", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: inventoryItem.uid,
                category: InventoryCategory.MEDICINE,
            })
        );

        expect(updated.category).toBe(InventoryCategory.MEDICINE);
    });

    test("Should update only unit", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: inventoryItem.uid,
                unit: InventoryUnit.LITER,
            })
        );

        expect(updated.unit).toBe(InventoryUnit.LITER);
    });

    test("Should update only description", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: inventoryItem.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
    });

    test("Should remove description", async () => {
        const inventoryItem = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                description: "Old description",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: inventoryItem.uid,
                description: undefined,
            })
        );

        expect(updated.description).toBeUndefined();
    });

    test("Should not update to duplicated inventory item", async () => {
        const item1 = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Corn",
            })
        );

        await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Soybean Meal",
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: item1.uid,
                name: "Soybean Meal",
            }),
            DuplicateInventoryItemError
        );
    });

    test("Should not update an inexistent inventory item", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-inventory-item",
                name: "New Item",
            }),
            InventoryItemNotFoundError
        );
    });

    test("Should not update inventory item from another platform", async () => {
        const inventoryItem = await setupInventoryItem(usecaseUser1, makeInventoryItem());

        expectFailure(
            await usecaseUser2.update({
                uid: inventoryItem.uid,
                name: "Updated Item",
            }),
            InventoryItemNotFoundError
        );
    });
});
