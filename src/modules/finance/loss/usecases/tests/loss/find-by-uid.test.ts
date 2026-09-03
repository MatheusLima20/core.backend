import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { LossNotFoundError } from "../../../errors/loss-not-found.error";
import { LossUsecase } from "../../loss.usecase";
import { dataLoss1 } from "../factories/loss-data.factory";
import { scenario } from "../setup/loss.builder";
import { setupLoss } from "../setup/loss-setup";

describe("LossUsecase - findByUID", () => {
    let usecaseUser1!: LossUsecase;
    let usecaseUser2!: LossUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (
            await (
                await (await scenario().loadUsers(["1", "2"])).loadInventoryItems()
            ).loadTransactions()
        )
            .createUsecases()
            .build());
    });

    test("Should find a loss by uid", async () => {
        const loss = await setupLoss(usecaseUser1, dataLoss1);

        const found = expectSuccess(await usecaseUser1.findByUID(loss.uid));

        expect(found).toMatchObject({
            uid: loss.uid,

            platformUID: user1.platformUID,

            productUID: dataLoss1.productUID,

            transactionUID: dataLoss1.transactionUID,

            quantity: dataLoss1.quantity,

            unitCost: dataLoss1.unitCost,

            totalCost: dataLoss1.totalCost,

            reason: dataLoss1.reason,

            description: dataLoss1.description,

            occurredAt: dataLoss1.occurredAt,

            createdBy: user1.uid,
        });
    });

    test("Should return LossNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), LossNotFoundError);
    });

    test("Should not find a loss from another platform", async () => {
        const loss = await setupLoss(usecaseUser1, dataLoss1);

        expectFailure(await usecaseUser2.findByUID(loss.uid), LossNotFoundError);
    });

    test("Should return all persisted loss data", async () => {
        const loss = await setupLoss(usecaseUser1, dataLoss1);

        const found = expectSuccess(await usecaseUser1.findByUID(loss.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: loss.uid,

                platformUID: user1.platformUID,

                productUID: dataLoss1.productUID,

                transactionUID: dataLoss1.transactionUID,

                quantity: dataLoss1.quantity,

                unitCost: dataLoss1.unitCost,

                totalCost: dataLoss1.totalCost,

                reason: dataLoss1.reason,

                description: dataLoss1.description,

                occurredAt: dataLoss1.occurredAt,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});
