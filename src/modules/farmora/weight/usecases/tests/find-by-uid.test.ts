import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { WeightUsecase } from "../weight.usecase";
import { makeWeight, weight1 } from "./factory/weight.factory";
import { setupWeight } from "./setup/setup-weight";
import { scenario } from "./setup/test-builder";
describe("WeightUsecase - findByUID", () => {
    let usecaseUser1!: WeightUsecase;
    let usecaseUser2!: WeightUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            weightUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);
    });

    test("Should find a weight by uid", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(weight.uid));

        expect(found).toMatchObject({
            uid: weight.uid,

            flockUID: flock1.uid,

            weighingDate: weight1.weighingDate,

            averageWeight: weight1.averageWeight,

            sampleSize: weight1.sampleSize,

            notes: weight1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecaseUser1.findByUID("invalid-uid"));

        expect(found).toBe(null);
    });

    test("Should not find a weight from another platform", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser2.findByUID(weight.uid));

        expect(found).toBe(null);
    });

    test("Should return all persisted weight data", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(weight.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: weight.uid,

                flockUID: flock1.uid,

                weighingDate: weight1.weighingDate,

                averageWeight: weight1.averageWeight,

                sampleSize: weight1.sampleSize,

                notes: weight1.notes,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return deleted weight", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        await usecaseUser1.delete(weight.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(weight.uid));

        expect(found).toBe(null);
    });
});
