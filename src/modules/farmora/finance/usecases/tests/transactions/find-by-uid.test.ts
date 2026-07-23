import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { TransactionNotFoundError } from "../../../errors/transaction-not-found.error";
import { TransactionUsecase } from "../../transaction.usecase";
import { dataTransaction1 } from "../factories/transaction-data.factory";
import { scenario } from "../setup/transaction.builder";
import { setupTransaction } from "../setup/transaction-tests.setup";

describe("TransactionUsecase - findByUID", () => {
    let usecaseUser1!: TransactionUsecase;
    let usecaseUser2!: TransactionUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a transaction by uid", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const found = expectSuccess(await usecaseUser1.findByUID(transaction.uid));

        expect(found).toMatchObject({
            uid: transaction.uid,

            platformUID: user1.platformUID,

            categoryUID: dataTransaction1.categoryUID,

            type: dataTransaction1.type,

            description: dataTransaction1.description,

            amount: dataTransaction1.amount,

            occurredAt: dataTransaction1.occurredAt,

            createdBy: user1.uid,
        });
    });

    test("Should return TransactionNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), TransactionNotFoundError);
    });

    test("Should not find a transaction from another platform", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        expectFailure(await usecaseUser2.findByUID(transaction.uid), TransactionNotFoundError);
    });

    test("Should return all persisted transaction data", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const found = expectSuccess(await usecaseUser1.findByUID(transaction.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: transaction.uid,

                platformUID: user1.platformUID,

                categoryUID: dataTransaction1.categoryUID,

                type: dataTransaction1.type,

                description: dataTransaction1.description,

                source: dataTransaction1.source,
                sourceUID: dataTransaction1.sourceUID,

                amount: dataTransaction1.amount,

                occurredAt: dataTransaction1.occurredAt,

                notes: dataTransaction1.notes,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});
