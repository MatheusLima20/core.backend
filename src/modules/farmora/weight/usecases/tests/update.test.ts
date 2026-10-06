import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { UpdateWeightDTO } from "../../dtos/update-weight.dto";
import { InvalidWeightError } from "../../errors/invalid-weight.error";
import { WeightNotFoundError } from "../../errors/weight-not-found.error";
import { WeightUsecase } from "../weight.usecase";
import { makeWeight } from "./factory/weight.factory";
import { setupWeight } from "./setup/setup-weight";
import { scenario } from "./setup/test-builder";

describe("WeightUsecase - update", () => {
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

    test("Should update a weight", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const data: UpdateWeightDTO = {
            uid: weight.uid,

            weighingDate: new Date("2026-08-01"),

            averageWeight: 2500,

            sampleSize: 100,

            notes: "Updated weighing",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: weight.uid,

            weighingDate: data.weighingDate,

            averageWeight: data.averageWeight,

            sampleSize: data.sampleSize,

            notes: data.notes,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(weight.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only average weight", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: weight.uid,

                averageWeight: 2300,
            })
        );

        expect(updated.averageWeight).toBe(2300);
    });

    test("Should update only sample size", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: weight.uid,

                sampleSize: 80,
            })
        );

        expect(updated.sampleSize).toBe(80);
    });

    test("Should update only notes", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: weight.uid,

                notes: "New notes",
            })
        );

        expect(updated.notes).toBe("New notes");
    });

    test("Should remove notes", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,

                notes: "Old notes",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: weight.uid,

                notes: undefined,
            })
        );

        expect(updated.notes).toBeUndefined();
    });

    test("Should not update weight with invalid average weight", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: weight.uid,

                averageWeight: 0,
            }),
            InvalidWeightError
        );
    });

    test("Should not update weight with invalid sample size", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: weight.uid,

                sampleSize: 0,
            }),
            InvalidWeightError
        );
    });

    test("Should not update an inexistent weight", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-weight",

                notes: "Updated",
            }),
            WeightNotFoundError
        );
    });

    test("Should not update weight from another platform", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser2.update({
                uid: weight.uid,

                notes: "Changed",
            }),
            WeightNotFoundError
        );
    });
});
