import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateTransactionCategoryDTO } from "../../../dtos/update-transaction-category.dto";
import { TransactionType } from "../../../enums/transaction.type";
import { TransactionCategoryAlreadyExistsError } from "../../../errors/transaction-category-already-exists.error";
import { TransactionCategoryNotFoundError } from "../../../errors/transaction-category-not-found.error";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";
import {
    dataTransactionCategory1,
    dataTransactionCategory2,
} from "../factories/transaction-category-data.factory";
import { scenario } from "../setup/transaction-category.builder";
import { setupTransactionCategory } from "../setup/transaction-category.setup";

describe("TransactionCategoryUsecase - update", () => {
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

    test("Should update a transaction category", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const data: UpdateTransactionCategoryDTO = {
            uid: category.uid,
            name: "Updated Category",
            description: "Updated description",
            type: TransactionType.EXPENSE,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: category.uid,
            name: data.name,
            description: data.description,
            type: data.type,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toMatchObject(updated);

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only description", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransactionCategory1,
                uid: category.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
    });

    test("Should update only type", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransactionCategory1,
                uid: category.uid,
                type: TransactionType.INCOME,
            })
        );

        expect(updated.type).toBe(TransactionType.INCOME);
    });

    test("Should not update duplicated category", async () => {
        const category1 = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        await setupTransactionCategory(usecaseUser1, dataTransactionCategory2);

        expectFailure(
            await usecaseUser1.update({
                ...dataTransactionCategory1,
                uid: category1.uid,
                name: dataTransactionCategory2.name,
            }),
            TransactionCategoryAlreadyExistsError
        );
    });

    test("Should not update an inexistent category", async () => {
        expectFailure(
            await usecaseUser1.update({
                ...dataTransactionCategory1,
                uid: "invalid-category",
                name: "Category",
            }),
            TransactionCategoryNotFoundError
        );
    });

    test("Should not update category from another platform", async () => {
        const category = await setupTransactionCategory(usecaseUser1, dataTransactionCategory1);

        expectFailure(
            await usecaseUser2.update({
                ...dataTransactionCategory1,
                uid: category.uid,
                name: "Updated",
            }),
            TransactionCategoryNotFoundError
        );
    });
});
