import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { InventoryCategory } from "../../enums/inventory-category.enum";
import { InventoryUnit } from "../../enums/inventory-unit.enum";
import { InventoryItemUsecase } from "../inventory-item.usecase";
import { makeInventoryItem } from "./factories/inventory-item.factory";
import { setupInventoryItem, setupInventoryItems } from "./setup/inventory-item.setup";
import { scenario } from "./setup/test-builder";

describe("InventoryUsecase - find", () => {
    let usecaseUser1!: InventoryItemUsecase;
    let usecaseUser2!: InventoryItemUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            inventoryItemUsecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform inventories", async () => {
        await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem(),
            makeInventoryItem({
                name: "Soybean Meal",
            })
        );

        const inventories = expectSuccess(await usecaseUser1.find());

        expect(inventories.every((inventory) => inventory.platformUID === user1.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no inventories", async () => {
        const inventories = expectSuccess(await usecaseUser2.find());

        expect(inventories).toEqual([]);
    });

    test("Should filter inventories by category", async () => {
        await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                category: InventoryCategory.FEED,
            }),
            makeInventoryItem({
                name: "Newcastle Vaccine",
                category: InventoryCategory.VACCINE,
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                category: InventoryCategory.FEED,
            })
        );

        expect(inventories).toHaveLength(1);

        expect(inventories[0].category).toBe(InventoryCategory.FEED);
    });

    test("Should filter inventories by unit", async () => {
        await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                unit: InventoryUnit.KG,
            }),
            makeInventoryItem({
                name: "Vitamin",
                unit: InventoryUnit.LITER,
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                unit: InventoryUnit.KG,
            })
        );

        expect(inventories).toHaveLength(1);

        expect(inventories[0].unit).toBe(InventoryUnit.KG);
    });

    test("Should filter inventories by stock tracking", async () => {
        await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                trackStock: true,
            }),
            makeInventoryItem({
                name: "Disposable Item",
                trackStock: false,
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                trackStock: true,
            })
        );

        expect(inventories).toHaveLength(1);

        expect(inventories[0].trackStock).toBe(true);
    });

    test("Should filter inventories by name", async () => {
        await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                name: "Corn",
            }),
            makeInventoryItem({
                name: "Soybean",
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                name: "Corn",
            })
        );

        expect(inventories).toHaveLength(1);

        expect(inventories[0].name).toBe("Corn");
    });

    test("Should order inventories by name descending", async () => {
        const corn = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Corn",
            })
        );

        const soybean = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Soybean",
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(inventories.map((item) => item.uid)).toEqual([soybean.uid, corn.uid]);
    });

    test("Should return first page", async () => {
        const [itemA, itemB] = await setupInventoryItems(
            usecaseUser1,
            makeInventoryItem({
                name: "Corn",
            }),
            makeInventoryItem({
                name: "Soybean",
            }),
            makeInventoryItem({
                name: "Wheat",
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(inventories).toHaveLength(2);

        expect(inventories.map((item) => item.uid)).toEqual([itemA.uid, itemB.uid]);
    });

    test("Should filter, order and paginate inventories", async () => {
        const itemB = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Corn",
                category: InventoryCategory.FEED,
            })
        );

        const itemA = await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Soybean",
                category: InventoryCategory.FEED,
            })
        );

        await setupInventoryItem(
            usecaseUser1,
            makeInventoryItem({
                name: "Vaccine",
                category: InventoryCategory.VACCINE,
            })
        );

        const inventories = expectSuccess(
            await usecaseUser1.find({
                category: InventoryCategory.FEED,
                orderBy: "name",
                order: "desc",
                page: 1,
                limit: 2,
            })
        );

        expect(inventories.map((item) => item.uid)).toEqual([itemA.uid, itemB.uid]);
    });
});
