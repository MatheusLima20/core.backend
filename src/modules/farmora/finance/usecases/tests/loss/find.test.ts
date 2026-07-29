import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { LossReason } from "../../../enums/loss-reason.enum";
import { LossUsecase } from "../../loss.usecase";
import { dataLoss1, dataLoss2 } from "../factories/loss-data.factory";
import { scenario } from "../setup/loss.builder";
import { setupLoss, setupLosses } from "../setup/loss-setup";

describe("LossUsecase - find", () => {
    let usecaseUser1!: LossUsecase;
    let usecaseUser2!: LossUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform losses", async () => {
        await setupLosses(usecaseUser1, dataLoss1, dataLoss2);

        const losses = expectSuccess(await usecaseUser1.find());

        expect(losses.every((loss) => loss.platformUID === user1.platformUID)).toBe(true);
    });

    test("Should return empty list when platform has no losses", async () => {
        const losses = expectSuccess(await usecaseUser2.find());

        expect(losses).toEqual([]);
    });

    test("Should filter losses by productUID", async () => {
        await setupLosses(usecaseUser1, dataLoss1, dataLoss2);

        const losses = expectSuccess(
            await usecaseUser1.find({
                productUID: dataLoss1.productUID,
            })
        );

        expect(losses).toHaveLength(1);

        expect(losses[0].productUID).toBe(dataLoss1.productUID);
    });

    test("Should filter losses by transactionUID", async () => {
        await setupLosses(usecaseUser1, dataLoss1, dataLoss2);

        const losses = expectSuccess(
            await usecaseUser1.find({
                transactionUID: dataLoss1.transactionUID,
            })
        );

        expect(losses).toHaveLength(1);

        expect(losses[0].transactionUID).toBe(dataLoss1.transactionUID);
    });

    test("Should filter losses by reason", async () => {
        await setupLosses(
            usecaseUser1,
            {
                ...dataLoss1,
                reason: LossReason.BROKEN_EGGS,
            },
            {
                ...dataLoss2,
                reason: LossReason.FEED_WASTE,
            }
        );

        const losses = expectSuccess(
            await usecaseUser1.find({
                reason: LossReason.FEED_WASTE,
            })
        );

        expect(losses).toHaveLength(1);

        expect(losses[0].reason).toBe(LossReason.FEED_WASTE);
    });

    test("Should search losses by productUID and reason", async () => {
        await setupLosses(usecaseUser1, dataLoss1, dataLoss2);

        const losses = expectSuccess(
            await usecaseUser1.find({
                productUID: dataLoss1.productUID,
                reason: dataLoss1.reason,
            })
        );

        expect(losses).toHaveLength(1);

        expect(losses[0]).toMatchObject({
            productUID: dataLoss1.productUID,
            reason: dataLoss1.reason,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        await setupLoss(usecaseUser1, dataLoss1);

        const losses = expectSuccess(
            await usecaseUser1.find({
                productUID: "invalid-product",
            })
        );

        expect(losses).toEqual([]);
    });

    test("Should order losses by occurredAt ascending", async () => {
        const lossA = await setupLoss(usecaseUser1, {
            ...dataLoss1,
            occurredAt: new Date("2026-01-10"),
        });

        const lossB = await setupLoss(usecaseUser1, {
            ...dataLoss2,
            occurredAt: new Date("2026-05-10"),
        });

        const losses = expectSuccess(
            await usecaseUser1.find({
                orderBy: "occurredAt",
                order: "asc",
            })
        );

        expect(losses.map((loss) => loss.uid)).toEqual([lossA.uid, lossB.uid]);
    });

    test("Should order losses by occurredAt descending", async () => {
        const lossA = await setupLoss(usecaseUser1, {
            ...dataLoss1,
            occurredAt: new Date("2026-01-10"),
        });

        const lossB = await setupLoss(usecaseUser1, {
            ...dataLoss2,
            occurredAt: new Date("2026-05-10"),
        });

        const losses = expectSuccess(
            await usecaseUser1.find({
                orderBy: "occurredAt",
                order: "desc",
            })
        );

        expect(losses.map((loss) => loss.uid)).toEqual([lossB.uid, lossA.uid]);
    });

    test("Should return first page", async () => {
        const [lossA, lossB] = await setupLosses(
            usecaseUser1,
            dataLoss1,
            dataLoss2,
            {
                ...dataLoss1,
                description: "Loss 3",
            },
            {
                ...dataLoss1,
                description: "Loss 4",
            }
        );

        const losses = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(losses).toHaveLength(2);

        expect(losses.map((loss) => loss.uid)).toEqual([lossA.uid, lossB.uid]);
    });

    test("Should return second page", async () => {
        const [, , lossC, lossD] = await setupLosses(
            usecaseUser1,
            dataLoss1,
            dataLoss2,
            {
                ...dataLoss1,
                description: "Loss 3",
            },
            {
                ...dataLoss1,
                description: "Loss 4",
            }
        );

        const losses = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(losses.map((loss) => loss.uid)).toEqual([lossC.uid, lossD.uid]);
    });

    test("Should return remaining losses on last page", async () => {
        const [, , , , lossE] = await setupLosses(
            usecaseUser1,
            dataLoss1,
            dataLoss2,
            {
                ...dataLoss1,
                description: "Loss 3",
            },
            {
                ...dataLoss1,
                description: "Loss 4",
            },
            {
                ...dataLoss1,
                description: "Loss 5",
            }
        );

        const losses = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(losses.map((loss) => loss.uid)).toEqual([lossE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupLosses(usecaseUser1, dataLoss1, dataLoss2);

        const losses = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            })
        );

        expect(losses).toEqual([]);
    });

    test("Should filter, order and paginate losses", async () => {
        const lossB = await setupLoss(usecaseUser1, {
            ...dataLoss1,
            occurredAt: new Date("2026-01-10"),
        });

        const lossA = await setupLoss(usecaseUser1, {
            ...dataLoss2,
            productUID: dataLoss1.productUID,
            occurredAt: new Date("2026-02-10"),
        });

        await setupLoss(usecaseUser1, {
            ...dataLoss1,
            occurredAt: new Date("2026-04-10"),
        });

        const losses = expectSuccess(
            await usecaseUser1.find({
                productUID: dataLoss1.productUID,
                orderBy: "occurredAt",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(losses.map((loss) => loss.uid)).toEqual([lossB.uid, lossA.uid]);
    });
});
