import { AuthUser } from "@/shared/context/auth.user";

import { TransactionType } from "../../../enums/transaction.type";
import { TransactionUsecase } from "../../transaction.usecase";
import { dataTransaction1, dataTransaction2 } from "../factories/transaction-data.factory";
import { scenario } from "../setup/transaction.builder";
import { setupTransaction } from "../setup/transaction-tests.setup";

describe("TransactionUsecase - create", () => {
    let transactionUsecaseUser1!: TransactionUsecase;
    let transactionUsecaseUser2!: TransactionUsecase;

    let user1!: AuthUser;
    //let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [transactionUsecaseUser1, transactionUsecaseUser2],

            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register a transaction", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, dataTransaction1);

        expect(transaction).toMatchObject({
            platformUID: user1.platformUID,

            createdBy: user1.uid,

            categoryUID: dataTransaction1.categoryUID,

            type: dataTransaction1.type,

            description: dataTransaction1.description,

            amount: dataTransaction1.amount,

            occurredAt: dataTransaction1.occurredAt,

            uid: expect.any(String),

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should allow duplicated transactions", async () => {
        await setupTransaction(transactionUsecaseUser1, dataTransaction1);

        await setupTransaction(transactionUsecaseUser1, dataTransaction1);
    });

    test("Should register income transaction", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, {
            ...dataTransaction1,
            type: TransactionType.INCOME,
        });

        expect(transaction.type).toBe(TransactionType.INCOME);
    });

    test("Should register expense transaction", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, {
            ...dataTransaction1,
            type: TransactionType.EXPENSE,
        });

        expect(transaction.type).toBe(TransactionType.EXPENSE);
    });

    test("Should register transaction with source", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, dataTransaction1);

        expect(transaction.source).toBe(dataTransaction1.source);

        expect(transaction.sourceUID).toBe(dataTransaction1.sourceUID);
    });

    test("Should register transaction without source", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, {
            ...dataTransaction2,
            source: undefined,
            sourceUID: undefined,
        });

        expect(transaction.source).toBeUndefined();

        expect(transaction.sourceUID).toBeUndefined();
    });

    test("Should register transaction with notes", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, dataTransaction1);

        expect(transaction.notes).toBe(dataTransaction1.notes);
    });

    test("Should register transaction without notes", async () => {
        const transaction = await setupTransaction(transactionUsecaseUser1, {
            ...dataTransaction2,
            notes: undefined,
        });

        expect(transaction.notes).toBeUndefined();
    });

    test("Should allow same transaction in different platforms", async () => {
        await setupTransaction(transactionUsecaseUser1, dataTransaction1);

        await setupTransaction(transactionUsecaseUser2, dataTransaction1);
    });
});
