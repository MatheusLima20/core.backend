import { AuthUser } from "@/shared/context/auth.user";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    closedFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { InvalidMortalityError } from "../../errors/invalid-mortality.error";
import { MortalityUsecase } from "../mortality.usecase";
import { makeMortality, mortality1 } from "./factories/mortality.factory";
import { setupMortality } from "./setup/setup-mortality";
import { scenario } from "./setup/test-builder";

describe("MortalityUsecase - create", () => {
    let usecaseUser1!: MortalityUsecase;
    let usecaseUser2!: MortalityUsecase;

    let flockUsecaseUser1!: FlockUsecase;
    let flockUsecaseUser2!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;
    let flock2!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            mortalityUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1, flockUsecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        flock2 = await setupFlock(flockUsecaseUser2, activeFlock);
    });

    async function createMortality(usecase: MortalityUsecase, flockUID: string) {
        return setupMortality(
            usecase,
            makeMortality({
                flockUID,
            })
        );
    }

    test("Should register mortality", async () => {
        const mortality = await createMortality(usecaseUser1, flock1.uid);

        expect(mortality).toMatchObject({
            flockUID: flock1.uid,

            mortalityDate: mortality1.mortalityDate,

            quantity: mortality1.quantity,

            cause: mortality1.cause,

            notes: mortality1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register mortalities in different platforms", async () => {
        const mortalityUser1 = await createMortality(usecaseUser1, flock1.uid);

        const mortalityUser2 = await createMortality(usecaseUser2, flock2.uid);

        expect(mortalityUser1.platformUID).toBe(user1.platformUID);

        expect(mortalityUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same mortality date in different platforms", async () => {
        await createMortality(usecaseUser1, flock1.uid);

        await createMortality(usecaseUser2, flock2.uid);
    });

    test("Should allow multiple mortalities on same day", async () => {
        await createMortality(usecaseUser1, flock1.uid);

        await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );
    });

    test("Should not register mortality for closed flock", async () => {
        const closed = await setupFlock(flockUsecaseUser1, closedFlock);

        expectFailure(
            await usecaseUser1.create(
                makeMortality({
                    flockUID: closed.uid,
                })
            ),
            FlockClosedError
        );
    });

    test("Should not register mortality greater than flock quantity", async () => {
        expectFailure(
            await usecaseUser1.create(
                makeMortality({
                    flockUID: flock1.uid,
                    quantity: flock1.quantity + 1,
                })
            ),
            InvalidMortalityError
        );
    });

    test("Should register mortality without notes", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
                notes: undefined,
            })
        );

        expect(mortality.notes).toBeUndefined();
    });
});
