import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockBreedNotFoundError } from "../../errors/flock-breed-not-found.error";
import { FlockBreedUsecase } from "../flock-breed.usecase";
import {
    flockBreed1,
    flockBreed2,
    flockBreed3,
    flockBreed4,
} from "./factories/flock-breed-data.factory";
import { scenario } from "./setup/flock-breed.builder";
import { setupFlockBreed, setupFlockBreeds } from "./setup/flock-breed.setup";

describe("FlockBreedUsecase - delete", () => {
    let usecaseUser1!: FlockBreedUsecase;
    let usecaseUser2!: FlockBreedUsecase;

    beforeEach(async () => {
        const testScenario = await scenario().loadUsers(["1", "2"]);

        await testScenario.loadFlocks();

        ({
            flockBreedUsecases: [usecaseUser1, usecaseUser2],
        } = testScenario.createUsecases().build());
    });

    test("Should delete a flock breed", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(flockBreed.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before.data).toHaveLength(1);
        expect(after.data).toHaveLength(0);

        const find = expectSuccess(await usecaseUser1.findByUID(flockBreed.uid));

        expect(find).toBe(null);
    });

    test("Should delete only selected flock breed", async () => {
        const [flockBreedA, flockBreedB] = await setupFlockBreeds(
            usecaseUser1,
            flockBreed1,
            flockBreed2
        );

        expectSuccess(await usecaseUser1.delete(flockBreedA.uid));

        const find = expectSuccess(await usecaseUser1.findByUID(flockBreedA.uid));

        expect(find).toBe(null);

        const remaining = expectSuccess(await usecaseUser1.findByUID(flockBreedB.uid));

        expect(remaining?.uid).toBe(flockBreedB.uid);
    });

    test("Should not delete an inexistent flock breed", async () => {
        expectFailure(await usecaseUser1.delete("invalid-flock-breed"), FlockBreedNotFoundError);
    });

    test("Should not delete flock breed from another platform", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        expectFailure(await usecaseUser2.delete(flockBreed.uid), FlockBreedNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(flockBreed.uid));
    });

    test("Should delete one flock breed keeping remaining flock breeds", async () => {
        const [flockBreedA, flockBreedB, flockBreedC] = await setupFlockBreeds(
            usecaseUser1,
            flockBreed1,
            flockBreed2,
            flockBreed3
        );

        expectSuccess(await usecaseUser1.delete(flockBreedB.uid));

        const flockBreeds = expectSuccess(await usecaseUser1.find());

        expect(flockBreeds.data).toHaveLength(2);

        expect(flockBreeds.data.map((flockBreed) => flockBreed.uid)).toEqual(
            expect.arrayContaining([flockBreedA.uid, flockBreedC.uid])
        );

        const find = expectSuccess(await usecaseUser1.findByUID(flockBreedB.uid));

        expect(find).toBe(null);
    });

    test("Should delete flock breed from another flock", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser2, flockBreed4);

        expect(flockBreed.flockUID).toBe(flockBreed4.flockUID);

        expectSuccess(await usecaseUser2.delete(flockBreed.uid));

        const find = expectSuccess(await usecaseUser2.findByUID(flockBreed.uid));

        expect(find).toBeNull();
    });
});
