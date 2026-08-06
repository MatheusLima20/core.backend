import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { WeightNotFoundError } from "../../errors/weight-not-found.error";
import { WeightUsecase } from "../weight.usecase";
import { makeWeight } from "./factory/weight.factory";
import { setupWeight } from "./setup/setup-weight";
import { scenario } from "./setup/test-builder";

describe("WeightUsecase - delete", () => {
    let usecaseUser1!: WeightUsecase;
    let usecaseUser2!: WeightUsecase;

    let flockUsecaseUser1!: any;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            weightUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);
    });

    async function createWeight(usecase: WeightUsecase, flockUID: string) {
        return setupWeight(
            usecase,
            makeWeight({
                flockUID,
            })
        );
    }

    test("Should delete a weight", async () => {
        const weight = await createWeight(usecaseUser1, flock1.uid);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(weight.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);

        expect(after).toHaveLength(0);

        const found = expectSuccess(await usecaseUser1.findByUID(weight.uid));

        expect(found).toBe(null);
    });

    test("Should delete only selected weight", async () => {
        const weightA = await createWeight(usecaseUser1, flock1.uid);

        const weightB = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        expectSuccess(await usecaseUser1.delete(weightA.uid));

        const deleted = expectSuccess(await usecaseUser1.findByUID(weightA.uid));

        expect(deleted).toBe(null);

        const remaining = expectSuccess(await usecaseUser1.findByUID(weightB.uid));

        expect(remaining?.uid).toBe(weightB.uid);
    });

    test("Should not delete an inexistent weight", async () => {
        expectFailure(await usecaseUser1.delete("invalid-weight"), WeightNotFoundError);
    });

    test("Should not delete weight from another platform", async () => {
        const weight = await createWeight(usecaseUser1, flock1.uid);

        expectFailure(await usecaseUser2.delete(weight.uid), WeightNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(weight.uid));
    });

    test("Should not delete weight from another platform without affecting data", async () => {
        const weight = await createWeight(usecaseUser1, flock1.uid);

        const user2Weights = expectSuccess(await usecaseUser2.find());

        expect(user2Weights).toHaveLength(0);

        expectFailure(await usecaseUser2.delete(weight.uid), WeightNotFoundError);

        const user1Weights = expectSuccess(await usecaseUser1.find());

        expect(user1Weights).toHaveLength(1);

        expect(user1Weights[0].uid).toBe(weight.uid);
    });

    test("Should delete one weight keeping remaining weights", async () => {
        const weightA = await createWeight(usecaseUser1, flock1.uid);

        const weightB = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        const weightC = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-03"),
            })
        );

        expectSuccess(await usecaseUser1.delete(weightB.uid));

        const weights = expectSuccess(await usecaseUser1.find());

        expect(weights).toHaveLength(2);

        expect(weights.map((weight) => weight.uid)).toEqual(
            expect.arrayContaining([weightA.uid, weightC.uid])
        );

        const deleted = expectSuccess(await usecaseUser1.findByUID(weightB.uid));

        expect(deleted).toBe(null);
    });
});
