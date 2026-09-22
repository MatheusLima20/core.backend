import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { CategoryUsecase } from "../category.usecase";
import { dataCategory1, dataCategory2 } from "./factories/category-data.factory";
import { scenario } from "./setup/category.builder";
import { setupCategories, setupCategory } from "./setup/category.setup";

describe("CategoryUsecase - find", () => {
    let usecaseUser1!: CategoryUsecase;
    let usecaseUser2!: CategoryUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform categories", async () => {
        await setupCategories(usecaseUser1, dataCategory1, dataCategory2);

        const categories = expectSuccess(await usecaseUser1.find());

        expect(
            categories.data.every((category) => category.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no categories", async () => {
        const categories = expectSuccess(await usecaseUser2.find());

        expect(categories.data).toEqual([]);
    });

    test("Should filter categories by name", async () => {
        await setupCategories(usecaseUser1, dataCategory1, dataCategory2);

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: dataCategory1.name,
            })
        );

        expect(categories.data).toHaveLength(1);
        expect(categories.data[0].name).toBe(dataCategory1.name);
    });

    test("Should search categories by name", async () => {
        await setupCategories(
            usecaseUser1,
            {
                ...dataCategory1,
                name: "Clothing",
            },
            {
                ...dataCategory2,
                name: "Women's Clothing",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: "Clothing",
            })
        );

        expect(categories.data).toHaveLength(2);
        expect(categories.data.every((category) => category.name.includes("Clothing"))).toBe(true);
    });

    test("Should return empty when filters match nothing", async () => {
        await setupCategory(usecaseUser1, dataCategory1);

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid Category",
            })
        );

        expect(categories.data).toEqual([]);
    });

    test("Should order categories by name ascending", async () => {
        const categoryB = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Banana",
        });

        const categoryA = await setupCategory(usecaseUser1, {
            ...dataCategory2,
            name: "Apple",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryA.uid,
            categoryB.uid,
        ]);
    });

    test("Should order categories by name descending", async () => {
        const categoryB = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Banana",
        });

        const categoryA = await setupCategory(usecaseUser1, {
            ...dataCategory2,
            name: "Apple",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryB.uid,
            categoryA.uid,
        ]);
    });

    test("Should return first page", async () => {
        const [categoryA, categoryB] = await setupCategories(
            usecaseUser1,
            dataCategory1,
            dataCategory2,
            {
                ...dataCategory1,
                name: "Category 3",
            },
            {
                ...dataCategory1,
                name: "Category 4",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(categories.data).toHaveLength(2);

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryA.uid,
            categoryB.uid,
        ]);
    });

    test("Should return second page", async () => {
        const [, , categoryC, categoryD] = await setupCategories(
            usecaseUser1,
            dataCategory1,
            dataCategory2,
            {
                ...dataCategory1,
                name: "Category 3",
            },
            {
                ...dataCategory1,
                name: "Category 4",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryC.uid,
            categoryD.uid,
        ]);
    });

    test("Should return remaining categories on last page", async () => {
        const [, , , , categoryE] = await setupCategories(
            usecaseUser1,
            dataCategory1,
            dataCategory2,
            {
                ...dataCategory1,
                name: "Category 3",
            },
            {
                ...dataCategory1,
                name: "Category 4",
            },
            {
                ...dataCategory1,
                name: "Category 5",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([categoryE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupCategories(usecaseUser1, dataCategory1, dataCategory2);

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(categories.data).toEqual([]);
    });

    test("Should filter and order categories", async () => {
        const categoryB = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Banana",
        });

        const categoryA = await setupCategory(usecaseUser1, {
            ...dataCategory2,
            name: "Apple",
        });

        await setupCategory(usecaseUser1, {
            ...dataCategory2,
            name: "Orange",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: "a",
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryA.uid,
            categoryB.uid,
        ]);
    });

    test("Should order before paginate", async () => {
        await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "A",
        });

        await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "B",
        });

        const categoryC = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "C",
        });

        const categoryD = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "D",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryC.uid,
            categoryD.uid,
        ]);
    });

    test("Should filter, order and paginate categories", async () => {
        const categoryB = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Banana",
        });

        const categoryA = await setupCategory(usecaseUser1, {
            ...dataCategory2,
            name: "Apple",
        });

        await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Orange",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: "a",
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(categories.data.map((category) => category.uid)).toEqual([
            categoryA.uid,
            categoryB.uid,
        ]);
    });
});
