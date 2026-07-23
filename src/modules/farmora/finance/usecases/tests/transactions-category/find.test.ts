import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { TransactionType } from "../../../enums/transaction.type";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";
import {
    dataTransactionCategory1,
    dataTransactionCategory2,
} from "../factories/transaction-category-data.factory";
import { scenario } from "../setup/transaction-category.builder";
import {
    setupTransactionCategories,
    setupTransactionCategory,
} from "../setup/transaction-category.setup";

describe("TransactionCategoryUsecase - find", () => {
    let usecaseUser1!: TransactionCategoryUsecase;
    let usecaseUser2!: TransactionCategoryUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform transaction categories", async () => {
        await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2
        );

        const categories = expectSuccess(await usecaseUser1.find());

        expect(categories.every((category) => category.platformUID === user1.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no transaction categories", async () => {
        const categories = expectSuccess(await usecaseUser2.find());

        expect(categories).toEqual([]);
    });

    test("Should filter transaction categories by name", async () => {
        await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: dataTransactionCategory1.name,
            })
        );

        expect(categories).toHaveLength(1);

        expect(categories[0].name).toBe(dataTransactionCategory1.name);
    });

    test("Should filter transaction categories by type", async () => {
        await setupTransactionCategories(
            usecaseUser1,
            {
                ...dataTransactionCategory1,
                type: TransactionType.EXPENSE,
            },
            {
                ...dataTransactionCategory2,
                type: TransactionType.INCOME,
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                type: TransactionType.INCOME,
            })
        );

        expect(categories).toHaveLength(1);

        expect(categories[0].type).toBe(TransactionType.INCOME);
    });

    test("Should search transaction categories by name and type", async () => {
        await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: dataTransactionCategory1.name,
                type: dataTransactionCategory1.type,
            })
        );

        expect(categories).toHaveLength(1);

        expect(categories[0]).toMatchObject({
            name: dataTransactionCategory1.name,
            type: dataTransactionCategory1.type,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const categories = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid Category",
            })
        );

        expect(categories).toEqual([]);
    });

    test("Should order transaction categories by name ascending", async () => {
        const categoryB = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "Banana",
        });

        const categoryA = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            name: "Apple",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryA.uid, categoryB.uid]);
    });

    test("Should order transaction categories by name descending", async () => {
        const categoryB = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "Banana",
        });

        const categoryA = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            name: "Apple",
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryB.uid, categoryA.uid]);
    });

    test("Should return first page", async () => {
        const [categoryA, categoryB] = await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2,
            {
                ...dataTransactionCategory1,
                name: "Category 3",
            },
            {
                ...dataTransactionCategory1,
                name: "Category 4",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(categories).toHaveLength(2);

        expect(categories.map((category) => category.uid)).toEqual([categoryA.uid, categoryB.uid]);
    });

    test("Should return second page", async () => {
        const [, , categoryC, categoryD] = await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2,
            {
                ...dataTransactionCategory1,
                name: "Category 3",
            },
            {
                ...dataTransactionCategory1,
                name: "Category 4",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryC.uid, categoryD.uid]);
    });

    test("Should return remaining transaction categories on last page", async () => {
        const [, , , , categoryE] = await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2,
            {
                ...dataTransactionCategory1,
                name: "Category 3",
            },
            {
                ...dataTransactionCategory1,
                name: "Category 4",
            },
            {
                ...dataTransactionCategory1,
                name: "Category 5",
            }
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2
        );

        const categories = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(categories).toEqual([]);
    });

    test("Should filter and order transaction categories", async () => {
        const categoryB = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "Banana",
            type: TransactionType.EXPENSE,
        });

        const categoryA = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            name: "Apple",
            type: TransactionType.EXPENSE,
        });

        await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            type: TransactionType.INCOME,
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                type: TransactionType.EXPENSE,
                orderBy: "name",
                order: "asc",
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryA.uid, categoryB.uid]);
    });

    test("Should order before paginate", async () => {
        await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "A",
        });

        await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "B",
        });

        const categoryC = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "C",
        });

        const categoryD = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
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

        expect(categories.map((category) => category.uid)).toEqual([categoryC.uid, categoryD.uid]);
    });

    test("Should filter, order and paginate transaction categories", async () => {
        const categoryB = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "Banana",
            type: TransactionType.EXPENSE,
        });

        const categoryA = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            name: "Apple",
            type: TransactionType.EXPENSE,
        });

        await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            name: "Orange",
            type: TransactionType.EXPENSE,
        });

        const categories = expectSuccess(
            await usecaseUser1.find({
                type: TransactionType.EXPENSE,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(categories.map((category) => category.uid)).toEqual([categoryA.uid, categoryB.uid]);
    });
});
