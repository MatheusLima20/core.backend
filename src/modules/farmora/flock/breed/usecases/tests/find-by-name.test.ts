import { expectSuccess } from "@/shared/tests/result.helper";

import { BreedUsecase } from "../breed.usecase";
import { dataBreed1, dataBreed2 } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { setupBreed, setupBreeds } from "./setup/breed-tests.setup";

describe("BreedUsecase - findByName", () => {
    let usecaseUser1!: BreedUsecase;
    let usecaseUser2!: BreedUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find breed by name", async () => {
        const [breed] = await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const found = expectSuccess(await usecaseUser1.findByName(dataBreed1.name));

        expect(found).not.toBeNull();

        expect(found).toMatchObject({
            uid: breed.uid,
            name: dataBreed1.name,
        });
    });

    test("Should find breed ignoring case", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const found = expectSuccess(await usecaseUser1.findByName(dataBreed1.name.toUpperCase()));

        expect(found).not.toBeNull();

        expect(found!.name).toBe(dataBreed1.name);
    });

    test("Should find breed ignoring leading and trailing spaces", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const found = expectSuccess(await usecaseUser1.findByName(`   ${dataBreed1.name}   `));

        expect(found).not.toBeNull();

        expect(found!.name).toBe(dataBreed1.name);
    });

    test("Should return null when breed does not exist", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const found = expectSuccess(await usecaseUser1.findByName("Hy-Line Brown"));

        expect(found).toBeNull();
    });

    test("Should not find breed from another platform", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        const found = expectSuccess(await usecaseUser2.findByName(dataBreed1.name));

        expect(found).toBeNull();
    });
});
