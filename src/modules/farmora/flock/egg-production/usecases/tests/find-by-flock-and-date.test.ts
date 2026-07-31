import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { EggProductionUsecase } from "../egg-production.usecase";
import { makeEggProduction, production1 } from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import { setupEggProduction } from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - findByFlockAndDate", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find egg production by flock and date", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
            })
        );

        const found = expectSuccess(
            await usecaseUser1.findByFlockAndDate(flock.uid, production1.productionDate)
        );

        expect(found).toMatchObject({
            uid: production.uid,

            flockUID: flock.uid,

            productionDate: production1.productionDate,

            totalEggs: production1.totalEggs,

            crackedEggs: production1.crackedEggs,

            dirtyEggs: production1.dirtyEggs,

            discardedEggs: production1.discardedEggs,

            notes: production1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when production does not exist", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const result = expectSuccess(
            await usecaseUser1.findByFlockAndDate(flock.uid, new Date("2026-01-01"))
        );

        expect(result).toBeNull();
    });

    test("Should not find production from another flock", async () => {
        const flockA = await setupFlock(flockUsecaseUser1, activeFlock);

        const flockB = await setupFlock(flockUsecaseUser1, {
            ...activeFlock,
            name: "Lote B",
        });

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flockA.uid,
            })
        );

        const found = expectSuccess(
            await usecaseUser1.findByFlockAndDate(flockB.uid, production1.productionDate)
        );

        expect(found).toBeNull();
    });

    test("Should not find production from another platform", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
            })
        );

        const found = expectSuccess(
            await usecaseUser2.findByFlockAndDate(flock.uid, production1.productionDate)
        );

        expect(found).toBeNull();
    });

    test("Should find production ignoring time when same day", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const productionDate = new Date("2026-07-30T08:00:00");

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate,
            })
        );

        const found = expectSuccess(
            await usecaseUser1.findByFlockAndDate(flock.uid, new Date("2026-07-30T18:30:00"))
        );

        expect(found).not.toBeNull();

        expect(found?.flockUID).toBe(flock.uid);
    });

    test("Should not find production from another day", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-30"),
            })
        );

        const found = expectSuccess(
            await usecaseUser1.findByFlockAndDate(flock.uid, new Date("2026-07-31"))
        );

        expect(found).toBeNull();
    });
});
