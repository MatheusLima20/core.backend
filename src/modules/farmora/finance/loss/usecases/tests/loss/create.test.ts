import { AuthUser } from "@/shared/context/auth.user";

import { LossReason } from "../../../enums/loss-reason.enum";
import { LossUsecase } from "../../loss.usecase";
import { dataLoss1, dataLoss2 } from "../factories/loss-data.factory";
import { scenario } from "../setup/loss.builder";
import { setupLoss } from "../setup/loss-setup";

describe("LossUsecase - create", () => {
    let lossUsecaseUser1!: LossUsecase;
    let lossUsecaseUser2!: LossUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [lossUsecaseUser1, lossUsecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register a loss", async () => {
        const loss = await setupLoss(lossUsecaseUser1, dataLoss1);

        expect(loss).toMatchObject({
            platformUID: user1.platformUID,

            createdBy: user1.uid,

            productUID: dataLoss1.productUID,

            quantity: dataLoss1.quantity,

            unitCost: dataLoss1.unitCost,

            totalCost: dataLoss1.totalCost,

            reason: dataLoss1.reason,

            description: dataLoss1.description,

            occurredAt: dataLoss1.occurredAt,

            uid: expect.any(String),

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should register losses with different users", async () => {
        const loss1 = await setupLoss(lossUsecaseUser1, dataLoss1);

        const loss2 = await setupLoss(lossUsecaseUser2, dataLoss2);

        expect(loss1.platformUID).toBe(user1.platformUID);

        expect(loss2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow duplicated losses", async () => {
        await setupLoss(lossUsecaseUser1, dataLoss1);

        await setupLoss(lossUsecaseUser1, dataLoss1);
    });

    test("Should register loss with transaction", async () => {
        const loss = await setupLoss(lossUsecaseUser1, dataLoss1);

        expect(loss.transactionUID).toBe(dataLoss1.transactionUID);
    });

    test("Should register loss without transaction", async () => {
        const loss = await setupLoss(lossUsecaseUser1, {
            ...dataLoss1,
            transactionUID: undefined,
        });

        expect(loss.transactionUID).toBeUndefined();
    });

    test("Should register loss with description", async () => {
        const loss = await setupLoss(lossUsecaseUser1, dataLoss1);

        expect(loss.description).toBe(dataLoss1.description);
    });

    test("Should register loss without description", async () => {
        const loss = await setupLoss(lossUsecaseUser1, {
            ...dataLoss1,
            description: undefined,
        });

        expect(loss.description).toBeUndefined();
    });

    test("Should register broken eggs loss", async () => {
        const loss = await setupLoss(lossUsecaseUser1, {
            ...dataLoss1,
            reason: LossReason.BROKEN_EGGS,
        });

        expect(loss.reason).toBe(LossReason.BROKEN_EGGS);
    });

    test("Should register feed waste loss", async () => {
        const loss = await setupLoss(lossUsecaseUser1, {
            ...dataLoss1,
            reason: LossReason.FEED_WASTE,
        });

        expect(loss.reason).toBe(LossReason.FEED_WASTE);
    });

    test("Should allow same loss in different platforms", async () => {
        await setupLoss(lossUsecaseUser1, dataLoss1);

        await setupLoss(lossUsecaseUser2, dataLoss1);
    });
});
