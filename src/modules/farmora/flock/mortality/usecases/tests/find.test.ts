import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    smallFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { MortalityCause } from "../../enums/mortality-cause.enum";
import { MortalityUsecase } from "../mortality.usecase";
import { makeMortality } from "./factories/mortality.factory";
import { setupMortalities, setupMortality } from "./setup/setup-mortality";
import { scenario } from "./setup/test-builder";

describe("MortalityUsecase - find", () => {
    let usecaseUser1!: MortalityUsecase;
    let usecaseUser2!: MortalityUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            mortalityUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform mortalities", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
            })
        );

        const mortalities = expectSuccess(await usecaseUser1.find());

        expect(mortalities.every((mortality) => mortality.platformUID === user1.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no mortalities", async () => {
        const mortalities = expectSuccess(await usecaseUser2.find());

        expect(mortalities).toEqual([]);
    });

    test("Should filter mortalities by flock", async () => {
        const flockA = await setupFlock(flockUsecaseUser1, activeFlock);

        const flockB = await setupFlock(flockUsecaseUser1, smallFlock);

        await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flockA.uid,
            })
        );

        await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flockB.uid,
                quantity: 5,
                mortalityDate: new Date("2026-07-10"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                flockUID: flockA.uid,
            })
        );

        expect(mortalities).toHaveLength(1);

        expect(mortalities[0].flockUID).toBe(flockA.uid);
    });

    test("Should filter mortalities by date", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-30"),
            })
        );

        await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                mortalityDate: new Date("2026-07-30"),
            })
        );

        expect(mortalities).toHaveLength(1);
    });

    test("Should filter mortalities by cause", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                cause: MortalityCause.DISEASE,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
                cause: MortalityCause.PREDATOR,
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                cause: MortalityCause.DISEASE,
            })
        );

        expect(mortalities).toHaveLength(1);

        expect(mortalities[0].cause).toBe(MortalityCause.DISEASE);
    });

    test("Should filter mortalities by minimum quantity", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                quantity: 1,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
                quantity: 8,
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                minQuantity: 5,
            })
        );

        expect(mortalities).toHaveLength(1);

        expect(mortalities[0].quantity).toBe(8);
    });

    test("Should order mortalities by date descending", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const oldest = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-01"),
            })
        );

        const newest = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-30"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                orderBy: "mortalityDate",
                order: "desc",
            })
        );

        expect(mortalities.map((m) => m.uid)).toEqual([newest.uid, oldest.uid]);
    });

    test("Should return first page", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const [mortalityA, mortalityB] = await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-28"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(mortalities).toHaveLength(2);

        expect(mortalities.map((m) => m.uid)).toEqual([mortalityA.uid, mortalityB.uid]);
    });

    test("Should filter, order and paginate mortalities", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        const mortalityB = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                quantity: 2,
                mortalityDate: new Date("2026-07-29"),
            })
        );

        const mortalityA = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                quantity: 5,
                mortalityDate: new Date("2026-07-30"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                flockUID: flock.uid,
                orderBy: "mortalityDate",
                order: "desc",
                page: 1,
                limit: 2,
            })
        );

        expect(mortalities.map((m) => m.uid)).toEqual([mortalityA.uid, mortalityB.uid]);
    });

    test("Should filter mortalities by date range", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-01"),
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-15"),
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-30"),
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                startDate: new Date("2026-07-10"),
                endDate: new Date("2026-07-20"),
            })
        );

        expect(mortalities).toHaveLength(1);

        expect(mortalities[0].mortalityDate).toEqual(new Date("2026-07-15"));
    });

    test("Should filter mortalities by maximum quantity", async () => {
        const flock = await setupFlock(flockUsecaseUser1, activeFlock);

        await setupMortalities(
            usecaseUser1,
            makeMortality({
                flockUID: flock.uid,
                quantity: 2,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-29"),
                quantity: 5,
            }),
            makeMortality({
                flockUID: flock.uid,
                mortalityDate: new Date("2026-07-30"),
                quantity: 8,
            })
        );

        const mortalities = expectSuccess(
            await usecaseUser1.find({
                maxQuantity: 5,
            })
        );

        expect(mortalities).toHaveLength(2);

        expect(mortalities.every((mortality) => mortality.quantity <= 5)).toBe(true);
    });
});
