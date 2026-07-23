import { AuthUser } from "@/shared/context/auth.user";

import { TransactionType } from "../../../enums/transaction.type";
import { TransactionCategoryAlreadyExistsError } from "../../../errors/transaction-category-already-exists.error";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";
import {
    dataTransactionCategory1,
    dataTransactionCategory2,
} from "../factories/transaction-category-data.factory";
import { scenario } from "../setup/transaction-category.builder";
import {
    expectCreateTransactionCategoryFailure,
    setupTransactionCategory,
} from "../setup/transaction-category.setup";

describe("TransactionCategoryUsecase - create", () => {
    let usecaseUser1!: TransactionCategoryUsecase;
    let usecaseUser2!: TransactionCategoryUsecase;

    let user1!: AuthUser;
    //let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register a transaction category", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        expect(category).toMatchObject({
            name: dataTransactionCategory1.name,
            description: dataTransactionCategory1.description,
            type: dataTransactionCategory1.type,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should allow same category in different platforms", async () => {
        await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        await setupTransactionCategory(usecaseUser2, dataTransactionCategory1);
    });

    test("Should not register duplicated category", async () => {
        await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        await expectCreateTransactionCategoryFailure(
            usecaseUser1,
            dataTransactionCategory1,
            TransactionCategoryAlreadyExistsError
        );
    });

    test("Should register income category", async () => {
        const category = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            type: TransactionType.INCOME,
        });

        expect(category.type).toBe(TransactionType.INCOME);
    });

    test("Should register expense category", async () => {
        const category = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory2,
            type: TransactionType.EXPENSE,
        });

        expect(category.type).toBe(TransactionType.EXPENSE);
    });

    test("Should register category with description", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        expect(category.description).toBe(dataTransactionCategory1.description);
    });

    test("Should register category without description", async () => {
        const category = await setupTransactionCategory(usecaseUser1, {
            ...dataTransactionCategory1,
            description: undefined,
        });

        expect(category.description).toBeUndefined();
    });
});
