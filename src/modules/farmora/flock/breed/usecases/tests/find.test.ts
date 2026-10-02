import { expectSuccess } from "@/shared/tests/result.helper";

import { BreedPurpose } from "../../enums/breed-origin.enum";
import { EggColor } from "../../enums/egg-color.enum";
import { InMemoryBreedRepository } from "../../repositories/implementations/in-memory-breed.repository";
import { BreedUsecase } from "../breed.usecase";

describe("BreedUsecase - find", () => {
    let usecase: BreedUsecase;

    beforeEach(() => {
        const repository = new InMemoryBreedRepository();

        usecase = new BreedUsecase(repository);
    });

    test("Should return all breeds", async () => {
        const breeds = expectSuccess(await usecase.find());

        expect(breeds.data.length).toBeGreaterThan(0);
    });

    test("Should filter breeds by name", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                name: "ISA Brown",
            })
        );

        expect(breeds.data).toHaveLength(1);
        expect(breeds.data[0].name).toBe("ISA Brown");
    });

    test("Should filter breeds by scientific name", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                scientificName: "Gallus gallus domesticus",
            })
        );

        expect(
            breeds.data.every((breed) => breed.scientificName === "Gallus gallus domesticus")
        ).toBe(true);
    });

    test("Should filter breeds by egg color", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                eggColor: EggColor.BROWN,
            })
        );

        expect(breeds.data.length).toBeGreaterThan(0);

        expect(breeds.data.every((breed) => breed.eggColor === EggColor.BROWN)).toBe(true);
    });

    test("Should filter breeds by purpose", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                breedPurpose: BreedPurpose.LAYING,
            })
        );

        expect(breeds.data.length).toBeGreaterThan(0);

        expect(breeds.data.every((breed) => breed.breedPurpose === BreedPurpose.LAYING)).toBe(true);
    });

    test("Should filter breeds by multiple criteria", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                eggColor: EggColor.BROWN,
                breedPurpose: BreedPurpose.LAYING,
            })
        );

        expect(breeds.data.length).toBeGreaterThan(0);

        expect(
            breeds.data.every(
                (breed) =>
                    breed.eggColor === EggColor.BROWN && breed.breedPurpose === BreedPurpose.LAYING
            )
        ).toBe(true);
    });

    test("Should return empty list when no breed matches filters", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                name: "Invalid Breed",
            })
        );

        expect(breeds.data).toEqual([]);
    });

    test("Should order breeds by name ascending", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                orderBy: "name",
                order: "asc",
            })
        );

        const names = breeds.data.map((breed) => breed.name);

        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    test("Should order breeds by name descending", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                orderBy: "name",
                order: "desc",
            })
        );

        const names = breeds.data.map((breed) => breed.name);

        expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });

    test("Should return first page", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                page: 1,
                limit: 2,
            })
        );

        expect(breeds.data).toHaveLength(2);
    });

    test("Should return empty list when page does not exist", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                page: 999,
                limit: 10,
            })
        );

        expect(breeds.data).toEqual([]);
    });

    test("Should order before paginate", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        const allBreeds = expectSuccess(
            await usecase.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual(
            allBreeds.data.slice(0, 2).map((breed) => breed.uid)
        );
    });

    test("Should filter, order and paginate breeds", async () => {
        const breeds = expectSuccess(
            await usecase.find({
                breedPurpose: BreedPurpose.LAYING,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(breeds.data).toHaveLength(2);

        expect(breeds.data.every((breed) => breed.breedPurpose === BreedPurpose.LAYING)).toBe(true);

        const names = breeds.data.map((breed) => breed.name);

        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });
});
