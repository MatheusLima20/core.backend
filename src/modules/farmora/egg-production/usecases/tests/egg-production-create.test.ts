import { AuthUser } from "@/shared/context/auth.user";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { closedFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { EggProductionAlreadyRegisteredError } from "../../errors/egg-production-already-registered.error";
import { EggProductionUsecase } from "../egg-production.usecase";
import {
    makeEggProduction,
    production1,
    production5,
} from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import {
    expectCreateEggProductionFailure,
    setupEggProduction,
} from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - create", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flockUsecaseUser1!: FlockUsecase;
    let _flockUsecaseUser2!: FlockUsecase;

    beforeEach(async () => {
        const testScenario = await scenario().loadUsers(["1", "2"]);

        await testScenario.loadFlocks();
        await testScenario.loadFlockBreeds();

        ({
            flockUsecases: [flockUsecaseUser1, _flockUsecaseUser2],
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = testScenario.createUsecases().build());
    });

    async function createProduction(usecase: EggProductionUsecase, data = production1) {
        return setupEggProduction(usecase, data);
    }

    test("Should register egg production", async () => {
        const production = await createProduction(usecaseUser1);

        expect(production).toMatchObject({
            flockUID: production1.flockUID,
            breedUID: production1.breedUID,

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
        const productionUser1 = await createProduction(usecaseUser1, production1);

        const productionUser2 = await createProduction(usecaseUser2, production5);

        expect(productionUser1.platformUID).toBe(user1.platformUID);

        expect(productionUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same production date in different platforms", async () => {
        await createProduction(usecaseUser1, production1);

        await createProduction(usecaseUser2, production5);
    });

    test("Should not register duplicated production for same flock and breed on same day", async () => {
        await createProduction(usecaseUser1, production1);

        await expectCreateEggProductionFailure(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                breedUID: production1.breedUID,
                productionDate: production1.productionDate,
            }),
            EggProductionAlreadyRegisteredError
        );
    });

    test("Should allow different breeds in the same flock on the same day", async () => {
        await createProduction(usecaseUser1, production1);

        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                breedUID: "brd-novogen-tinted",
                productionDate: production1.productionDate,
                totalEggs: 30,
            })
        );

        expect(production.flockUID).toBe(production1.flockUID);
        expect(production.breedUID).toBe("brd-novogen-tinted");
        expect(production.productionDate).toEqual(production1.productionDate);
    });

    test("Should allow same flock and breed on a different day", async () => {
        await createProduction(usecaseUser1, production1);

        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                breedUID: production1.breedUID,
                productionDate: new Date("2026-07-02"),
                totalEggs: 30,
            })
        );

        expect(production.flockUID).toBe(production1.flockUID);
        expect(production.breedUID).toBe(production1.breedUID);
        expect(production.productionDate).toEqual(new Date("2026-07-02"));
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

    test("Should register production without notes", async () => {
        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                notes: undefined,
            })
        );

        expect(production.notes).toBeUndefined();
    });

    test("Should register production without cracked eggs", async () => {
        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                crackedEggs: 0,
            })
        );

        expect(production.crackedEggs).toBe(0);
    });

    test("Should register production without dirty eggs", async () => {
        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                dirtyEggs: 0,
            })
        );

        expect(production.dirtyEggs).toBe(0);
    });

    test("Should register production without discarded eggs", async () => {
        const production = await createProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: production1.flockUID,
                discardedEggs: 0,
            })
        );

        expect(production.discardedEggs).toBe(0);
    });
});
