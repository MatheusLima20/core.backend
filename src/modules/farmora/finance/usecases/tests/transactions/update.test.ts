import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateTransactionDTO } from "../../../dtos/update-transaction.dto";
import { TransactionType } from "../../../enums/transaction.type";
import { TransactionNotFoundError } from "../../../errors/transaction-not-found.error";
import { TransactionUsecase } from "../../transaction.usecase";
import { dataTransaction1, dataTransaction2 } from "../factories/transaction-data.factory";
import { scenario } from "../setup/transaction.builder";
import { setupTransaction } from "../setup/transaction-tests.setup";

describe("TransactionUsecase - update", () => {
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

    test("Should update a transaction", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const data: UpdateTransactionDTO = {
            uid: transaction.uid,
            categoryUID: dataTransaction2.categoryUID,
            type: TransactionType.INCOME,
            description: "Updated transaction",
            amount: 999,
            occurredAt: new Date("2030-01-01"),
            notes: "Updated notes",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));
        expect(updated).toMatchObject({
            uid: transaction.uid,
            categoryUID: data.categoryUID,
            type: data.type,
            description: data.description,
            amount: data.amount,
            occurredAt: data.occurredAt,
            notes: data.notes,
            updatedBy: user1.uid,
            updatedAt: expect.any(Date),
        });

        const found = expectSuccess(await usecaseUser1.findByUID(transaction.uid));

        expect(found).toMatchObject(updated);

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only description", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransaction1,
                uid: transaction.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
        expect(updated.amount).toBe(transaction.amount);
    });

    test("Should update only amount", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransaction1,
                uid: transaction.uid,
                amount: 350,
            })
        );

        expect(updated.amount).toBe(350);
    });

    test("Should update only category", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransaction1,
                uid: transaction.uid,
                categoryUID: "new-category",
            })
        );

        expect(updated.categoryUID).toBe("new-category");
    });

    test("Should update only notes", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataTransaction1,
                uid: transaction.uid,
                notes: "Edited note",
            })
        );

        expect(updated.notes).toBe("Edited note");
    });

    test("Should not update an inexistent transaction", async () => {
        expectFailure(
            await usecaseUser1.update({
                ...dataTransaction1,
                uid: "invalid-transaction",
                description: "Test",
            }),
            TransactionNotFoundError
        );
    });

    test("Should not update transaction from another platform", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        expectFailure(
            await usecaseUser2.update({
                ...dataTransaction1,
                uid: transaction.uid,
                description: "Updated",
            }),
            TransactionNotFoundError
        );
    });
});
