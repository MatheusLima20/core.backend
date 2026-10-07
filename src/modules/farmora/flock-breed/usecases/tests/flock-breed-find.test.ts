import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockBreedUsecase } from "../flock-breed.usecase";
import {
    flockBreed1,
    flockBreed2,
    flockBreed3,
    flockBreed5,
} from "./factories/flock-breed-data.factory";
import { scenario } from "./setup/flock-breed.builder";
import { setupFlockBreed, setupFlockBreeds } from "./setup/flock-breed.setup";

describe("FlockBreedUsecase - find", () => {
    let usecaseUser1!: FlockBreedUsecase;
    let usecaseUser2!: FlockBreedUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            flockBreedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await (await scenario().loadUsers(["1", "2"])).loadFlocks()).createUsecases().build());
    });

    test("Should find all platform flock breeds", async () => {
        await setupFlockBreeds(usecaseUser1, flockBreed1, flockBreed2, flockBreed3);

        const flockBreeds = expectSuccess(await usecaseUser1.find());

        expect(
            flockBreeds.data.every((flockBreed) => flockBreed.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no flock breeds", async () => {
        const flockBreeds = expectSuccess(await usecaseUser2.find());

        expect(flockBreeds.data).toEqual([]);
    });

    test("Should filter flock breeds by flock uid", async () => {
        await setupFlockBreeds(usecaseUser1, flockBreed1, flockBreed2);

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                flockUID: flockBreed1.flockUID,
            })
        );

        expect(flockBreeds.data).toHaveLength(2);

        expect(
            flockBreeds.data.every((flockBreed) => flockBreed.flockUID === flockBreed1.flockUID)
        ).toBe(true);
    });

    test("Should filter flock breeds by breed uid", async () => {
        await setupFlockBreeds(usecaseUser1, flockBreed1, flockBreed2, {
            ...flockBreed3,
            breedUID: flockBreed1.breedUID,
            flockUID: "flk-test-2",
        });

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                breedUID: flockBreed1.breedUID,
            })
        );

        expect(flockBreeds.data).toHaveLength(2);

        expect(
            flockBreeds.data.every((flockBreed) => flockBreed.breedUID === flockBreed1.breedUID)
        ).toBe(true);
    });

    test("Should filter flock breeds by minimum quantity", async () => {
        await setupFlockBreeds(usecaseUser1, flockBreed1, flockBreed2, flockBreed5);

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                minQuantity: 35,
            })
        );

        expect(flockBreeds.data).toHaveLength(3);

        expect(flockBreeds.data.every((flockBreed) => flockBreed.quantity >= 35)).toBe(true);
    });

    test("Should filter flock breeds by maximum quantity", async () => {
        await setupFlockBreeds(usecaseUser1, flockBreed1, flockBreed2, flockBreed3);

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                maxQuantity: 35,
            })
        );

        expect(flockBreeds.data).toHaveLength(2);

        expect(flockBreeds.data.every((flockBreed) => flockBreed.quantity <= 35)).toBe(true);
    });

    test("Should return empty when filters match nothing", async () => {
        await setupFlockBreed(usecaseUser1, flockBreed1);

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                breedUID: "invalid-breed",
            })
        );

        expect(flockBreeds.data).toEqual([]);
    });

    test("Should order flock breeds by quantity ascending", async () => {
        const flockBreedA = await setupFlockBreed(usecaseUser1, {
            ...flockBreed1,
            quantity: 20,
        });

        const flockBreedB = await setupFlockBreed(usecaseUser1, {
            ...flockBreed2,
            quantity: 50,
        });

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "asc",
            })
        );

        expect(flockBreeds.data.map((flockBreed) => flockBreed.uid)).toEqual([
            flockBreedA.uid,
            flockBreedB.uid,
        ]);
    });

    test("Should desc order flock breeds by createdAt", async () => {
        const oldest = await setupFlockBreed(usecaseUser1, {
            ...flockBreed1,
            createdAt: new Date("2026-02-10"),
        });

        const newest = await setupFlockBreed(usecaseUser1, {
            ...flockBreed2,
            createdAt: new Date("2026-09-10"),
        });

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "createdAt",
                order: "desc",
            })
        );

        expect(flockBreeds.data[0].uid).toBe(newest.uid);
        expect(flockBreeds.data[1].uid).toBe(oldest.uid);
    });

    test("Should return first page", async () => {
        const [flockBreedA, flockBreedB, _flockBreedC, _flockBreedD] = await setupFlockBreeds(
            usecaseUser1,
            flockBreed1,
            flockBreed2,
            flockBreed3,
            flockBreed5
        );

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(flockBreeds.data).toHaveLength(2);

        expect(flockBreeds.data.map((flockBreed) => flockBreed.uid)).toEqual([
            flockBreedA.uid,
            flockBreedB.uid,
        ]);
    });

    test("Should return second page", async () => {
        const [_flockBreedA, _flockBreedB, flockBreedC, flockBreedD] = await setupFlockBreeds(
            usecaseUser1,
            flockBreed1,
            flockBreed2,
            flockBreed3,
            flockBreed5
        );

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(flockBreeds.data).toHaveLength(2);

        expect(flockBreeds.data.map((flockBreed) => flockBreed.uid)).toEqual([
            flockBreedC.uid,
            flockBreedD.uid,
        ]);
    });

    test("Should filter, order and paginate flock breeds", async () => {
        const flockBreedA = await setupFlockBreed(usecaseUser1, {
            ...flockBreed1,
            quantity: 20,
        });

        const flockBreedB = await setupFlockBreed(usecaseUser1, {
            ...flockBreed2,
            quantity: 40,
        });

        await setupFlockBreed(usecaseUser1, {
            ...flockBreed3,
            quantity: 60,
        });

        const flockBreeds = expectSuccess(
            await usecaseUser1.find({
                flockUID: flockBreed1.flockUID,
                minQuantity: 20,
                orderBy: "quantity",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(flockBreeds.data.map((flockBreed) => flockBreed.uid)).toEqual([
            flockBreedA.uid,
            flockBreedB.uid,
        ]);
    });
});
