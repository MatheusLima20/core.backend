import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    smallFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { EggProductionUsecase } from "../egg-production.usecase";
import { makeEggProduction } from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import { setupEggProduction, setupEggProductions } from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - find", () => {
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

    test("Should find all platform productions", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupEggProductions(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
            }),
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-29"),
            })
        );

        const productions = expectSuccess(await usecaseUser1.find());

        expect(
            productions.every((production) => production.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no productions", async () => {
        const productions = expectSuccess(await usecaseUser2.find());

        expect(productions).toEqual([]);
    });

    test("Should filter productions by flock", async () => {
        const flockA = await setupFlock(flockUsecaseUser1, activeFlock);

        const flockB = await setupFlock(flockUsecaseUser1, smallFlock);

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flockA.uid,
            })
        );

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flockB.uid,
                totalEggs: 20,
                productionDate: new Date("2026-07-10"),
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                flockUID: flockA.uid,
            })
        );

        expect(productions).toHaveLength(1);

        expect(productions[0].flockUID).toBe(flockA.uid);
    });

    test("Should filter productions by production date", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-30"),
            })
        );

        await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-29"),
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                productionDate: new Date("2026-07-30"),
            })
        );

        expect(productions).toHaveLength(1);
    });

    test("Should filter productions by minimum eggs", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupEggProductions(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                totalEggs: 50,
            }),
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-29"),
                totalEggs: 120,
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                minTotalEggs: 100,
            })
        );

        expect(productions).toHaveLength(1);

        expect(productions[0].totalEggs).toBe(120);
    });

    test("Should order productions by date descending", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const oldest = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-01"),
            })
        );

        const newest = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-30"),
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                orderBy: "productionDate",
                order: "desc",
            })
        );

        expect(productions.map((production) => production.uid)).toEqual([newest.uid, oldest.uid]);
    });

    test("Should return first page", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const [productionA, productionB] = await setupEggProductions(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
            }),
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-29"),
            }),
            makeEggProduction({
                flockUID: flock.uid,
                productionDate: new Date("2026-07-28"),
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(productions).toHaveLength(2);

        expect(productions.map((production) => production.uid)).toEqual([
            productionA.uid,
            productionB.uid,
        ]);
    });

    test("Should filter, order and paginate productions", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const productionB = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                totalEggs: 100,
                productionDate: new Date("2026-07-29"),
            })
        );

        const productionA = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock.uid,
                totalEggs: 110,
                productionDate: new Date("2026-07-30"),
            })
        );

        const productions = expectSuccess(
            await usecaseUser1.find({
                flockUID: flock.uid,
                orderBy: "productionDate",
                order: "desc",
                page: 1,
                limit: 2,
            })
        );

        expect(productions.map((production) => production.uid)).toEqual([
            productionA.uid,
            productionB.uid,
        ]);
    });
});
