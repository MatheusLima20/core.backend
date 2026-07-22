import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { TransactionCategoryNotFoundError } from "../../../errors/transaction-category-not-found.error";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";
import {
    dataTransactionCategory1,
    dataTransactionCategory2,
    makeTransactionCategory,
} from "../factories/transaction-category-data.factory";
import { scenario } from "../setup/transaction-category.builder";
import {
    setupTransactionCategories,
    setupTransactionCategory,
} from "../setup/transaction-category.setup";

describe("TransactionCategoryUsecase - delete", () => {
    let usecaseUser1!: TransactionCategoryUsecase;
    let usecaseUser2!: TransactionCategoryUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a transaction category", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(category.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(category.uid), TransactionCategoryNotFoundError);
    });

    test("Should delete only selected transaction category", async () => {
        const [categoryA, categoryB] = await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2
        );

        expectSuccess(await usecaseUser1.delete(categoryA.uid));

        expectFailure(
            await usecaseUser1.findByUID(categoryA.uid),
            TransactionCategoryNotFoundError
        );

        const remaining = expectSuccess(await usecaseUser1.findByUID(categoryB.uid));

        expect(remaining.uid).toBe(categoryB.uid);
    });

    test("Should not delete an inexistent transaction category", async () => {
        expectFailure(
            await usecaseUser1.delete("invalid-category"),
            TransactionCategoryNotFoundError
        );
    });

    test("Should not delete transaction category from another platform", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        expectFailure(await usecaseUser2.delete(category.uid), TransactionCategoryNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(category.uid));
    });

    test("Should delete one transaction category keeping remaining categories", async () => {
        const [categoryA, categoryB, categoryC] = await setupTransactionCategories(
            usecaseUser1,
            dataTransactionCategory1,
            dataTransactionCategory2,
            makeTransactionCategory({
                name: "Utilities",
            })
        );

        expectSuccess(await usecaseUser1.delete(categoryB.uid));

        const categories = expectSuccess(await usecaseUser1.find());

        expect(categories).toHaveLength(2);

        expect(categories.map((category) => category.uid)).toEqual(
            expect.arrayContaining([categoryA.uid, categoryC.uid])
        );

        expectFailure(
            await usecaseUser1.findByUID(categoryB.uid),
            TransactionCategoryNotFoundError
        );
    });
});
