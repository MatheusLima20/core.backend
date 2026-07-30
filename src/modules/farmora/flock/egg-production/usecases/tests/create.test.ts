import { AuthUser } from "@/shared/context/auth.user";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    closedFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { EggProductionAlreadyRegisteredError } from "../../errors/egg-production-already-registered.error";
import { InvalidEggProductionError } from "../../errors/invalid-egg-production.error";
import { EggProductionUsecase } from "../egg-production.usecase";
import { makeEggProduction, production1 } from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import {
    expectCreateEggProductionFailure,
    setupEggProduction,
} from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - create", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let flockUsecaseUser1!: FlockUsecase;
    let flockUsecaseUser2!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;
    let flock2!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1, flockUsecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        flock2 = await setupFlock(flockUsecaseUser2, activeFlock);
    });

    async function createProduction(usecase: EggProductionUsecase, flockUID: string) {
        return setupEggProduction(
            usecase,
            makeEggProduction({
                flockUID,
            })
        );
    }

    test("Should register egg production", async () => {
        const production = await createProduction(usecaseUser1, flock1.uid);

        expect(production).toMatchObject({
            flockUID: flock1.uid,

            productionDate: production1.productionDate,

            totalEggs: production1.totalEggs,

            crackedEggs: production1.crackedEggs,

            dirtyEggs: production1.dirtyEggs,

            discardedEggs: production1.discardedEggs,

            notes: production1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register productions in different platforms", async () => {
        const productionUser1 = await createProduction(usecaseUser1, flock1.uid);

        const productionUser2 = await createProduction(usecaseUser2, flock2.uid);

        expect(productionUser1.platformUID).toBe(user1.platformUID);

        expect(productionUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same production date in different platforms", async () => {
        await createProduction(usecaseUser1, flock1.uid);

        await createProduction(usecaseUser2, flock2.uid);
    });

    test("Should not register duplicated production on same day", async () => {
        await createProduction(usecaseUser1, flock1.uid);

        await expectCreateEggProductionFailure(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            }),
            EggProductionAlreadyRegisteredError
        );
    });

    test("Should not register production for closed flock", async () => {
        const closed = await setupFlock(flockUsecaseUser1, closedFlock);

        expectFailure(
            await usecaseUser1.create(
                makeEggProduction({
                    flockUID: closed.uid,
                })
            ),
            FlockClosedError
        );
    });

    test("Should not register production greater than flock quantity", async () => {
        expectFailure(
            await usecaseUser1.create(
                makeEggProduction({
                    flockUID: flock1.uid,
                    totalEggs: flock1.quantity + 1,
                })
            ),
            InvalidEggProductionError
        );
    });

    test("Should register production without notes", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
                notes: undefined,
            })
        );

        expect(production.notes).toBeUndefined();
    });

    test("Should register production without cracked eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
                crackedEggs: 0,
            })
        );

        expect(production.crackedEggs).toBe(0);
    });

    test("Should register production without dirty eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
                dirtyEggs: 0,
            })
        );

        expect(production.dirtyEggs).toBe(0);
    });

    test("Should register production without discarded eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
                discardedEggs: 0,
            })
        );

        expect(production.discardedEggs).toBe(0);
    });
});
