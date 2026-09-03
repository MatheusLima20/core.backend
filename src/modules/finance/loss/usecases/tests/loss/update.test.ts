import { expectSuccess } from "@/shared/tests/result.helper";

import { LossReason } from "../../../enums/loss-reason.enum";
import { LossUsecase } from "../../loss.usecase";
import { dataLoss1 } from "../factories/loss-data.factory";
import { scenario } from "../setup/loss.builder";
import { setupLoss } from "../setup/loss-setup";

describe("LossUsecase - update", () => {
    let lossUsecase!: LossUsecase;

    beforeEach(async () => {
        ({
            usecases: [lossUsecase],
        } = (
            await (
                await (await scenario().loadUsers(["1", "2"])).loadInventoryItems()
            ).loadTransactions()
        )
            .createUsecases()
            .build());
    });

    test("Should update a loss", async () => {
        const created = await setupLoss(lossUsecase, dataLoss1);

        const updated = expectSuccess(
            await lossUsecase.update({
                ...dataLoss1,
                uid: created.uid,

                quantity: 20,

                unitCost: 3,

                totalCost: 60,

                reason: LossReason.OTHER,

                description: "Updated loss",
            })
        );

        expect(updated).toMatchObject({
            uid: created.uid,

            quantity: 20,

            unitCost: 3,

            totalCost: 60,

            reason: LossReason.OTHER,

            description: "Updated loss",

            updatedBy: expect.any(String),

            updatedAt: expect.any(Date),
        });
    });

    test("Should update only description", async () => {
        const created = await setupLoss(lossUsecase, dataLoss1);

        const updated = expectSuccess(
            await lossUsecase.update({
                ...dataLoss1,
                uid: created.uid,

                description: "Only description changed",
            })
        );

        expect(updated.description).toBe("Only description changed");

        expect(updated.quantity).toBe(created.quantity);
    });

    test("Should update only quantity", async () => {
        const created = await setupLoss(lossUsecase, dataLoss1);

        const updated = expectSuccess(
            await lossUsecase.update({
                ...dataLoss1,
                uid: created.uid,

                quantity: 50,
            })
        );

        expect(updated.quantity).toBe(50);

        expect(updated.unitCost).toBe(created.unitCost);
    });

    test("Should remove description", async () => {
        const created = await setupLoss(lossUsecase, dataLoss1);

        const updated = expectSuccess(
            await lossUsecase.update({
                ...dataLoss1,
                uid: created.uid,

                description: undefined,
            })
        );

        expect(updated.description).toBeUndefined();
    });
});
