import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { MortalityUsecase } from "../mortality.usecase";
import { makeMortality, mortality1 } from "./factories/mortality.factory";
import { setupMortality } from "./setup/setup-mortality";
import { scenario } from "./setup/test-builder";

describe("MortalityUsecase - findByUID", () => {
    let usecaseUser1!: MortalityUsecase;
    let usecaseUser2!: MortalityUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            mortalityUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);
    });

    test("Should find a mortality by uid", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(mortality.uid));

        expect(found).toMatchObject({
            uid: mortality.uid,

            flockUID: flock1.uid,

            mortalityDate: mortality1.mortalityDate,

            quantity: mortality1.quantity,

            cause: mortality1.cause,

            notes: mortality1.notes,

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

    test("Should not find a mortality from another platform", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser2.findByUID(mortality.uid));

        expect(found).toBe(null);
    });

    test("Should return all persisted mortality data", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(mortality.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: mortality.uid,

                flockUID: flock1.uid,

                mortalityDate: mortality1.mortalityDate,

                quantity: mortality1.quantity,

                cause: mortality1.cause,

                notes: mortality1.notes,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return deleted mortality", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        await usecaseUser1.delete(mortality.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(mortality.uid));

        expect(found).toBe(null);
    });
});
