import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockStatus } from "../../enums/flock-status.enum";
import { FlockUsecase } from "../flock.usecase";
import {
    activeFlock,
    closedFlock,
    largeFlock,
    mediumFlock,
    newestFlock,
    oldestFlock,
    smallFlock,
} from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { setupFlock, setupFlocks } from "./setup/flock-tests.setup";

describe("FlockUsecase - find", () => {
    let usecaseUser1!: FlockUsecase;
    let usecaseUser2!: FlockUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform flocks", async () => {
        await setupFlocks(usecaseUser1, activeFlock, closedFlock);

        const flocks = expectSuccess(await usecaseUser1.find());

        expect(flocks.every((flock) => flock.platformUID === user1.platformUID)).toBe(true);
    });

    test("Should return empty list when platform has no flocks", async () => {
        const flocks = expectSuccess(await usecaseUser2.find());

        expect(flocks).toEqual([]);
    });

    test("Should filter flocks by name", async () => {
        await setupFlocks(usecaseUser1, activeFlock, closedFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                name: activeFlock.name,
            })
        );

        expect(flocks).toHaveLength(1);

        expect(flocks[0].name).toBe(activeFlock.name);
    });

    test("Should filter flocks by status", async () => {
        await setupFlocks(usecaseUser1, activeFlock, closedFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                status: FlockStatus.CLOSED,
            })
        );

        expect(flocks).toHaveLength(1);

        expect(flocks[0].status).toBe(FlockStatus.CLOSED);
    });

    test("Should filter flocks by minimum quantity", async () => {
        await setupFlocks(usecaseUser1, smallFlock, mediumFlock, largeFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                minQuantity: 100,
            })
        );

        expect(flocks).toHaveLength(1);

        expect(flocks[0].quantity).toBe(largeFlock.quantity);
    });

    test("Should filter flocks by maximum quantity", async () => {
        await setupFlocks(usecaseUser1, smallFlock, mediumFlock, largeFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                maxQuantity: 50,
            })
        );

        expect(flocks).toHaveLength(1);

        expect(flocks[0].quantity).toBe(smallFlock.quantity);
    });

    test("Should filter flocks by quantity range", async () => {
        await setupFlocks(usecaseUser1, smallFlock, mediumFlock, largeFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                minQuantity: 50,
                maxQuantity: 100,
            })
        );

        expect(flocks).toHaveLength(1);

        expect(flocks[0].quantity).toBe(mediumFlock.quantity);
    });

    test("Should return empty when filters match nothing", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid flock",
            })
        );

        expect(flocks).toEqual([]);
    });

    test("Should order flocks by name ascending", async () => {
        const flockB = await setupFlock(usecaseUser1, {
            ...activeFlock,
            name: "Banana",
        });

        const flockA = await setupFlock(usecaseUser1, {
            ...closedFlock,
            name: "Apple",
        });

        const flocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(flocks.map((flock) => flock.uid)).toEqual([flockA.uid, flockB.uid]);
    });

    test("Should order flocks by quantity descending", async () => {
        const small = await setupFlock(usecaseUser1, smallFlock);

        const large = await setupFlock(usecaseUser1, largeFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "desc",
            })
        );

        expect(flocks.map((flock) => flock.uid)).toEqual([large.uid, small.uid]);
    });

    test("Should desc order flocks by createdAt", async () => {
        await setupFlock(usecaseUser1, {
            ...oldestFlock,
            createdAt: new Date("2026-02-10"),
        });

        const newest = await setupFlock(usecaseUser1, newestFlock);

        const flocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "createdAt",
                order: "desc",
            })
        );

        expect(flocks[0].uid).toBe(newest.uid);
    });

    test("Should return first page", async () => {
        const [flockA, flockB] = await setupFlocks(
            usecaseUser1,
            activeFlock,
            closedFlock,
            smallFlock,
            mediumFlock
        );

        const flocks = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(flocks).toHaveLength(2);

        expect(flocks.map((flock) => flock.uid)).toEqual([flockA.uid, flockB.uid]);
    });

    test("Should return second page", async () => {
        const [, , flockC, flockD] = await setupFlocks(
            usecaseUser1,
            activeFlock,
            closedFlock,
            smallFlock,
            mediumFlock
        );

        const flocks = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(flocks.map((flock) => flock.uid)).toEqual([flockC.uid, flockD.uid]);
    });

    test("Should filter, order and paginate flocks", async () => {
        const flockB = await setupFlock(usecaseUser1, {
            ...activeFlock,
            name: "Banana",
            status: FlockStatus.ACTIVE,
        });

        const flockA = await setupFlock(usecaseUser1, {
            ...activeFlock,
            name: "Apple",
            status: FlockStatus.ACTIVE,
        });

        await setupFlock(usecaseUser1, {
            ...closedFlock,
            status: FlockStatus.CLOSED,
        });

        const flocks = expectSuccess(
            await usecaseUser1.find({
                status: FlockStatus.ACTIVE,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(flocks.map((flock) => flock.uid)).toEqual([flockA.uid, flockB.uid]);
    });
});
