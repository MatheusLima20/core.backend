import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { FlockBreedUsecase } from "../../../flock-breed/usecases/flock-breed.usecase";
import { EggProductionNotFoundError } from "../../errors/egg-production-not-found.error";
import { EggProductionUsecase } from "../egg-production.usecase";
import {
    makeEggProduction,
    production1,
    production2,
} from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import { setupEggProduction } from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - delete", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let _flockUsecaseUser1!: FlockUsecase;
    let _flockBreedUsecaseUser1!: FlockBreedUsecase;

    beforeEach(async () => {
        ({
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [_flockUsecaseUser1],
            flockBreedUsecases: [_flockBreedUsecaseUser1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete an egg production", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(production.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before.data).toHaveLength(1);
        expect(after.data).toHaveLength(0);

        const found = expectSuccess(await usecaseUser1.findByUID(production.uid));

        expect(found).toBeNull();
    });

    test("Should delete only selected production", async () => {
        const productionA = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                ...production1,
            })
        );

        const productionB = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                ...production2,
            })
        );

        expectSuccess(await usecaseUser1.delete(productionA.uid));

        const found = expectSuccess(await usecaseUser1.findByUID(productionA.uid));

        expect(found).toBeNull();

        const remaining = expectSuccess(await usecaseUser1.findByUID(productionB.uid));

        expect(remaining?.uid).toBe(productionB.uid);
    });

    test("Should not delete an inexistent production", async () => {
        expectFailure(await usecaseUser1.delete("invalid-production"), EggProductionNotFoundError);
    });

    test("Should not delete production from another platform", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        expectFailure(await usecaseUser2.delete(production.uid), EggProductionNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(production.uid));
    });

    test("Should not delete production from another platform without affecting data", async () => {
        const production = await setupEggProduction(usecaseUser1, makeEggProduction());

        const user2Productions = expectSuccess(await usecaseUser2.find());

        expect(user2Productions.data).toHaveLength(0);

        expectFailure(await usecaseUser2.delete(production.uid), EggProductionNotFoundError);

        const user1Productions = expectSuccess(await usecaseUser1.find());

        expect(user1Productions.data).toHaveLength(1);
        expect(user1Productions.data[0].uid).toBe(production.uid);
    });
});
