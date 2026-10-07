import { FlockUsecase } from "@/modules/farmora/flock/usecases/flock.usecase";
import { FlockBreedUsecase } from "@/modules/farmora/flock-breed/usecases/flock-breed.usecase";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { EggProductionUsecase } from "../egg-production.usecase";
import { makeEggProduction } from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import { setupEggProduction } from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - findByUID", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let _flockUsecaseUser1!: FlockUsecase;
    let _flockBreedUsecaseUser1!: FlockBreedUsecase;

    let user1!: AuthUser;

    let user2!: AuthUser;

    beforeEach(async () => {
        const testScenario = await scenario().loadUsers(["1", "2"]);

        await testScenario.loadFlocks();
        await testScenario.loadFlockBreeds();

        ({
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [_flockUsecaseUser1],
            flockBreedUsecases: [_flockBreedUsecaseUser1],
            users: [user1, user2],
        } = testScenario.createUsecases().build());
    });

    test("Should find an egg production by uid", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        const found = expectSuccess(await usecaseUser1.findByUID(production.uid));

        expect(found).toMatchObject({
            uid: production.uid,

            flockUID: production.flockUID,
            breedUID: production.breedUID,

            productionDate: production.productionDate,

            totalEggs: production.totalEggs,

            crackedEggs: production.crackedEggs,

            dirtyEggs: production.dirtyEggs,

            discardedEggs: production.discardedEggs,

            notes: production.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecaseUser1.findByUID("invalid-uid"));

        expect(found).toBeNull();
    });

    test("Should not find an egg production from another platform", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        const found = expectSuccess(await usecaseUser2.findByUID(production.uid));

        expect(found).toBeNull();
    });

    test("Should return all persisted egg production data", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                notes: "Test production",
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(production.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: production.uid,

                flockUID: production.flockUID,
                breedUID: production.breedUID,

                productionDate: production.productionDate,

                totalEggs: production.totalEggs,

                crackedEggs: production.crackedEggs,

                dirtyEggs: production.dirtyEggs,

                discardedEggs: production.discardedEggs,

                notes: "Test production",

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return egg production deleted from platform", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        await usecaseUser1.delete(production.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(production.uid));

        expect(found).toBeNull();
    });
});
