import { AuthUser } from "@/shared/context/auth.user";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    closedFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { DuplicateWeightError } from "../../errors/duplicate-weight.error";
import { InvalidWeightError } from "../../errors/invalid-weight.error";
import { WeightUsecase } from "../weight.usecase";
import { makeWeight, weight1 } from "./factory/weight.factory";
import { setupWeight } from "./setup/setup-weight";
import { scenario } from "./setup/test-builder";

describe("WeightUsecase - create", () => {
    let usecaseUser1!: WeightUsecase;
    let usecaseUser2!: WeightUsecase;

    let flockUsecaseUser1!: FlockUsecase;
    let flockUsecaseUser2!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;
    let flock2!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            weightUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1, flockUsecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        flock2 = await setupFlock(flockUsecaseUser2, activeFlock);
    });

    async function createWeight(usecase: WeightUsecase, flockUID: string) {
        return setupWeight(
            usecase,
            makeWeight({
                flockUID,
            })
        );
    }

    test("Should register weight", async () => {
        const weight = await createWeight(usecaseUser1, flock1.uid);

        expect(weight).toMatchObject({
            flockUID: flock1.uid,

            weighingDate: weight1.weighingDate,

            averageWeight: weight1.averageWeight,

            sampleSize: weight1.sampleSize,

            notes: weight1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register weights in different platforms", async () => {
        const weightUser1 = await createWeight(usecaseUser1, flock1.uid);

        const weightUser2 = await createWeight(usecaseUser2, flock2.uid);

        expect(weightUser1.platformUID).toBe(user1.platformUID);

        expect(weightUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same weighing date in different platforms", async () => {
        await createWeight(usecaseUser1, flock1.uid);

        await createWeight(usecaseUser2, flock2.uid);
    });

    test("Should not register duplicate weight", async () => {
        await createWeight(usecaseUser1, flock1.uid);

        expectFailure(
            await usecaseUser1.create(
                makeWeight({
                    flockUID: flock1.uid,
                })
            ),
            DuplicateWeightError
        );
    });

    test("Should not register weight for closed flock", async () => {
        const closed = await setupFlock(flockUsecaseUser1, closedFlock);

        expectFailure(
            await usecaseUser1.create(
                makeWeight({
                    flockUID: closed.uid,
                })
            ),
            FlockClosedError
        );
    });

    test("Should not register weight with invalid average weight", async () => {
        expectFailure(
            await usecaseUser1.create(
                makeWeight({
                    flockUID: flock1.uid,
                    averageWeight: 0,
                })
            ),
            InvalidWeightError
        );
    });

    test("Should not register weight with invalid sample size", async () => {
        expectFailure(
            await usecaseUser1.create(
                makeWeight({
                    flockUID: flock1.uid,
                    sampleSize: 0,
                })
            ),
            InvalidWeightError
        );
    });

    test("Should register weight without notes", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                notes: undefined,
            })
        );

        expect(weight.notes).toBeUndefined();
    });

    test("Should register weight without sample size", async () => {
        const weight = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                sampleSize: undefined,
            })
        );

        expect(weight.sampleSize).toBeUndefined();
    });
});
