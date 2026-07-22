import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { TransactionType } from "../../../enums/transaction.type";
import { TransactionUsecase } from "../../transaction.usecase";
import { dataTransaction1, dataTransaction2 } from "../factories/transaction-data.factory";
import { scenario } from "../setup/transaction.builder";
import { setupTransaction, setupTransactions } from "../setup/transaction-tests.setup";

describe("TransactionUsecase - find", () => {
    let usecaseUser1!: TransactionUsecase;
    let usecaseUser2!: TransactionUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1"])).createUsecases().build());
    });

    test("Should find all platform transactions", async () => {
        await setupTransactions(usecaseUser1, dataTransaction1, dataTransaction2);

        const transactions = expectSuccess(await usecaseUser1.find());

        expect(
            transactions.every((transaction) => transaction.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no transactions", async () => {
        const transactions = expectSuccess(await usecaseUser2.find());

        expect(transactions).toEqual([]);
    });

    test("Should filter transactions by categoryUID", async () => {
        await setupTransactions(usecaseUser1, dataTransaction1, dataTransaction2);

        const transactions = expectSuccess(
            await usecaseUser1.find({
                categoryUID: dataTransaction1.categoryUID,
            })
        );

        expect(transactions).toHaveLength(1);

        expect(transactions[0].categoryUID).toBe(dataTransaction1.categoryUID);
    });

    test("Should filter transactions by type", async () => {
        await setupTransactions(
            usecaseUser1,
            {
                ...dataTransaction1,
                type: TransactionType.EXPENSE,
            },
            {
                ...dataTransaction2,
                type: TransactionType.INCOME,
            }
        );

        const transactions = expectSuccess(
            await usecaseUser1.find({
                type: TransactionType.INCOME,
            })
        );

        expect(transactions).toHaveLength(1);

        expect(transactions[0].type).toBe(TransactionType.INCOME);
    });

    test("Should filter transactions by description", async () => {
        await setupTransactions(usecaseUser1, dataTransaction1, dataTransaction2);

        const transactions = expectSuccess(
            await usecaseUser1.find({
                description: dataTransaction1.description,
            })
        );

        expect(transactions).toHaveLength(1);

        expect(transactions[0].description).toBe(dataTransaction1.description);
    });

    test("Should search transactions by categoryUID and type", async () => {
        await setupTransactions(usecaseUser1, dataTransaction1, dataTransaction2);

        const transactions = expectSuccess(
            await usecaseUser1.find({
                categoryUID: dataTransaction1.categoryUID,
                type: dataTransaction1.type,
            })
        );

        expect(transactions).toHaveLength(1);

        expect(transactions[0]).toMatchObject({
            categoryUID: dataTransaction1.categoryUID,
            type: dataTransaction1.type,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        await setupTransaction(usecaseUser1, dataTransaction1);

        const transactions = expectSuccess(
            await usecaseUser1.find({
                description: "Invalid description",
            })
        );

        expect(transactions).toEqual([]);
    });

    test("Should order transactions by occurredAt ascending", async () => {
        const transactionA = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-01-10"),
        });

        const transactionB = await setupTransaction(usecaseUser1, {
            ...dataTransaction2,
            occurredAt: new Date("2026-05-10"),
        });

        const transactions = expectSuccess(
            await usecaseUser1.find({
                orderBy: "occurredAt",
                order: "asc",
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionA.uid,
            transactionB.uid,
        ]);
    });

    test("Should order transactions by occurredAt descending", async () => {
        const transactionA = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-01-10"),
        });

        const transactionB = await setupTransaction(usecaseUser1, {
            ...dataTransaction2,
            occurredAt: new Date("2026-05-10"),
        });

        const transactions = expectSuccess(
            await usecaseUser1.find({
                orderBy: "occurredAt",
                order: "desc",
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionB.uid,
            transactionA.uid,
        ]);
    });

    test("Should return first page", async () => {
        const [transactionA, transactionB] = await setupTransactions(
            usecaseUser1,
            dataTransaction1,
            dataTransaction2,
            {
                ...dataTransaction1,
                description: "Transaction 3",
            },
            {
                ...dataTransaction1,
                description: "Transaction 4",
            }
        );

        const transactions = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(transactions).toHaveLength(2);

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionA.uid,
            transactionB.uid,
        ]);
    });

    test("Should return second page", async () => {
        const [, , transactionC, transactionD] = await setupTransactions(
            usecaseUser1,
            dataTransaction1,
            dataTransaction2,
            {
                ...dataTransaction1,
                description: "Transaction 3",
            },
            {
                ...dataTransaction1,
                description: "Transaction 4",
            }
        );

        const transactions = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionC.uid,
            transactionD.uid,
        ]);
    });

    test("Should return remaining transactions on last page", async () => {
        const [, , , , transactionE] = await setupTransactions(
            usecaseUser1,
            dataTransaction1,
            dataTransaction2,
            {
                ...dataTransaction1,
                description: "Transaction 3",
            },
            {
                ...dataTransaction1,
                description: "Transaction 4",
            },
            {
                ...dataTransaction1,
                description: "Transaction 5",
            }
        );

        const transactions = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([transactionE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupTransactions(usecaseUser1, dataTransaction1, dataTransaction2);

        const transactions = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            })
        );

        expect(transactions).toEqual([]);
    });

    test("Should filter and order transactions", async () => {
        const transactionB = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-01-10"),
        });

        const transactionA = await setupTransaction(usecaseUser1, {
            ...dataTransaction2,
            type: dataTransaction1.type,
            occurredAt: new Date("2026-03-10"),
        });

        const transactions = expectSuccess(
            await usecaseUser1.find({
                type: dataTransaction1.type,
                orderBy: "occurredAt",
                order: "asc",
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionB.uid,
            transactionA.uid,
        ]);
    });

    test("Should order before paginate", async () => {
        await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-01-10"),
        });

        await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-02-10"),
        });

        const transactionC = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-03-10"),
        });

        const transactionD = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-04-10"),
        });

        const transactions = expectSuccess(
            await usecaseUser1.find({
                orderBy: "occurredAt",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionC.uid,
            transactionD.uid,
        ]);
    });

    test("Should filter, order and paginate transactions", async () => {
        const transactionB = await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-01-10"),
        });

        const transactionA = await setupTransaction(usecaseUser1, {
            ...dataTransaction2,
            type: dataTransaction1.type,
            occurredAt: new Date("2026-02-10"),
        });

        await setupTransaction(usecaseUser1, {
            ...dataTransaction1,
            occurredAt: new Date("2026-04-10"),
        });

        const transactions = expectSuccess(
            await usecaseUser1.find({
                type: dataTransaction1.type,
                orderBy: "occurredAt",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(transactions.map((transaction) => transaction.uid)).toEqual([
            transactionB.uid,
            transactionA.uid,
        ]);
    });
});
