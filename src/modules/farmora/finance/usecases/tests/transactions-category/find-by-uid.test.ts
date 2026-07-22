import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { TransactionCategoryNotFoundError } from "../../../errors/transaction-category-not-found.error";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";
import { dataTransactionCategory1 } from "../factories/transaction-category-data.factory";
import { scenario } from "../setup/transaction-category.builder";
import { setupTransactionCategory } from "../setup/transaction-category.setup";

describe("TransactionCategoryUsecase - findByUID", () => {
    let usecaseUser1!: TransactionCategoryUsecase;
    let usecaseUser2!: TransactionCategoryUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a transaction category by uid", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toMatchObject({
            uid: category.uid,

            name: dataTransactionCategory1.name,

            description: dataTransactionCategory1.description,

            type: dataTransactionCategory1.type,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        });
    });

    test("Should return TransactionCategoryNotFoundError when uid does not exist", async () => {
        expectFailure(
            await usecaseUser1.findByUID("invalid-uid"),
            TransactionCategoryNotFoundError
        );
    });

    test("Should not find a transaction category from another platform", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        expectFailure(await usecaseUser2.findByUID(category.uid), TransactionCategoryNotFoundError);
    });

    test("Should return all persisted transaction category data", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: category.uid,

                name: dataTransactionCategory1.name,

                description: dataTransactionCategory1.description,

                type: dataTransactionCategory1.type,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});
