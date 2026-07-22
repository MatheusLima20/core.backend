import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { TransactionNotFoundError } from "../../../errors/transaction-not-found.error";
import { TransactionUsecase } from "../../transaction.usecase";
import { dataTransaction1, dataTransaction2 } from "../factories/transaction-data.factory";
import { scenario } from "../setup/transaction.builder";
import { setupTransaction, setupTransactions } from "../setup/transaction-tests.setup";

describe("TransactionUsecase - delete", () => {
    let usecaseUser1!: TransactionUsecase;
    let usecaseUser2!: TransactionUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a transaction", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(transaction.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(transaction.uid), TransactionNotFoundError);
    });

    test("Should delete only selected transaction", async () => {
        const [transactionA, transactionB] = await setupTransactions(
            usecaseUser1,
            dataTransaction1,
            dataTransaction2
        );

        expectSuccess(await usecaseUser1.delete(transactionA.uid));

        expectFailure(await usecaseUser1.findByUID(transactionA.uid), TransactionNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(transactionB.uid));

        expect(remaining.uid).toBe(transactionB.uid);
    });

    test("Should not delete an inexistent transaction", async () => {
        expectFailure(await usecaseUser1.delete("invalid-transaction"), TransactionNotFoundError);
    });

    test("Should not delete transaction from another platform", async () => {
        const transaction = await setupTransaction(usecaseUser1, dataTransaction1);

        expectFailure(await usecaseUser2.delete(transaction.uid), TransactionNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(transaction.uid));
    });

    test("Should delete one transaction keeping remaining transactions", async () => {
        const [transactionA, transactionB, transactionC] = await setupTransactions(
            usecaseUser1,
            dataTransaction1,
            dataTransaction2,
            {
                ...dataTransaction1,
                description: "Another transaction",
            }
        );

        expectSuccess(await usecaseUser1.delete(transactionB.uid));

        const transactions = expectSuccess(await usecaseUser1.find());

        expect(transactions).toHaveLength(2);

        expect(transactions.map((transaction) => transaction.uid)).toEqual(
            expect.arrayContaining([transactionA.uid, transactionC.uid])
        );

        expectFailure(await usecaseUser1.findByUID(transactionB.uid), TransactionNotFoundError);
    });
});
