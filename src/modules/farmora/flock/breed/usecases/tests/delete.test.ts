import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { BreedNotFoundError } from "../../errors/breed-not-found.error";
import { BreedUsecase } from "../breed.usecase";
import { dataBreed1, dataBreed2, makeBreed } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { setupBreed, setupBreeds } from "./setup/breed-tests.setup";

describe("BreedUsecase - delete", () => {
    let usecaseUser1!: BreedUsecase;
    let usecaseUser2!: BreedUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a breed", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(breed.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(breed.uid), BreedNotFoundError);
    });

    test("Should delete only selected breed", async () => {
        const [breedA, breedB] = await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        expectSuccess(await usecaseUser1.delete(breedA.uid));

        expectFailure(await usecaseUser1.findByUID(breedA.uid), BreedNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(breedB.uid));

        expect(remaining.uid).toBe(breedB.uid);
    });

    test("Should not delete an inexistent breed", async () => {
        expectFailure(await usecaseUser1.delete("invalid-breed"), BreedNotFoundError);
    });

    test("Should not delete breed from another platform", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        expectFailure(await usecaseUser2.delete(breed.uid), BreedNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(breed.uid));
    });

    test("Should delete one breed keeping remaining breeds", async () => {
        const [breedA, breedB, breedC] = await setupBreeds(
            usecaseUser1,
            dataBreed1,
            dataBreed2,
            makeBreed({
                name: "Caipira Pesadão",
            })
        );

        expectSuccess(await usecaseUser1.delete(breedB.uid));

        const breeds = expectSuccess(await usecaseUser1.find());

        expect(breeds).toHaveLength(2);

        expect(breeds.map((breed) => breed.uid)).toEqual(
            expect.arrayContaining([breedA.uid, breedC.uid])
        );

        expectFailure(await usecaseUser1.findByUID(breedB.uid), BreedNotFoundError);
    });
});
