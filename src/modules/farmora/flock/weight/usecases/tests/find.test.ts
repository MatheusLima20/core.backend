import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    smallFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { WeightUsecase } from "../weight.usecase";
import { makeWeight } from "./factory/weight.factory";
import { setupWeight, setupWeights } from "./setup/setup-weight";
import { scenario } from "./setup/test-builder";

describe("WeightUsecase - find", () => {
    let usecaseUser1!: WeightUsecase;
    let usecaseUser2!: WeightUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    let flock2!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            weightUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        flock2 = await setupFlock(flockUsecaseUser1, smallFlock);
    });

    test("Should find all platform weights", async () => {
        await setupWeights(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            }),
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        const weights = expectSuccess(await usecaseUser1.find());

        expect(weights.data.every((weight) => weight.platformUID === user1.platformUID)).toBe(true);
    });

    test("Should return empty list when platform has no weights", async () => {
        const weights = expectSuccess(await usecaseUser2.find());

        expect(weights.data).toEqual([]);
    });

    test("Should filter weights by flock", async () => {
        await setupWeights(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
            }),
            makeWeight({
                flockUID: flock2.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                flockUID: flock1.uid,
            })
        );

        expect(weights.data).toHaveLength(1);

        expect(weights.data[0].flockUID).toBe(flock1.uid);
    });

    test("Should filter weights by weighing date", async () => {
        await setupWeights(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-01"),
            }),
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                weighingDate: new Date("2026-01-01"),
            })
        );

        expect(weights.data).toHaveLength(1);

        expect(weights.data[0].weighingDate).toEqual(new Date("2026-01-01"));
    });

    test("Should filter weights by date range", async () => {
        await setupWeights(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-01"),
            }),
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-02-01"),
            }),
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-03-01"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                startDate: new Date("2026-02-01"),
                endDate: new Date("2026-02-28"),
            })
        );

        expect(weights.data).toHaveLength(1);

        expect(weights.data[0].weighingDate).toEqual(new Date("2026-02-01"));
    });

    test("Should order weights by weighing date descending", async () => {
        const first = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-01"),
            })
        );

        const second = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                orderBy: "weighingDate",
                order: "desc",
            })
        );

        expect(weights.data.map((weight) => weight.uid)).toEqual([second.uid, first.uid]);
    });

    test("Should return first page", async () => {
        const weightA = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-01"),
            })
        );

        const weightB = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-03"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(weights.data).toHaveLength(2);

        expect(weights.data.map((weight) => weight.uid)).toEqual([weightA.uid, weightB.uid]);
    });

    test("Should filter, order and paginate weights", async () => {
        const weightB = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-01"),
            })
        );

        const weightA = await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock1.uid,
                weighingDate: new Date("2026-01-02"),
            })
        );

        await setupWeight(
            usecaseUser1,
            makeWeight({
                flockUID: flock2.uid,
                weighingDate: new Date("2026-01-03"),
            })
        );

        const weights = expectSuccess(
            await usecaseUser1.find({
                flockUID: flock1.uid,

                orderBy: "weighingDate",

                order: "desc",

                page: 1,

                limit: 2,
            })
        );

        expect(weights.data.map((weight) => weight.uid)).toEqual([weightA.uid, weightB.uid]);
    });
});
