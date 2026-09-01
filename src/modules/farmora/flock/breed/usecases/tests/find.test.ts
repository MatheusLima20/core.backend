import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { BreedPurpose } from "../../enums/breed-origin.enum";
import { BreedUsecase } from "../breed.usecase";
import { dataBreed1, dataBreed2 } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { setupBreed, setupBreeds } from "./setup/breed-tests.setup";

describe("BreedUsecase - find", () => {
    let usecaseUser1!: BreedUsecase;
    let usecaseUser2!: BreedUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform breeds", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(await usecaseUser1.find());

        expect(breeds.data.every((breed) => breed.platformUID === user1.platformUID)).toBe(true);
    });

    test("Should return empty list when platform has no breeds", async () => {
        const breeds = expectSuccess(await usecaseUser2.find());

        expect(breeds.data).toEqual([]);
    });

    test("Should filter breeds by name", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                name: dataBreed1.name,
            })
        );

        expect(breeds.data).toHaveLength(1);

        expect(breeds.data[0].name).toBe(dataBreed1.name);
    });

    test("Should filter breeds by egg color", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                eggColor: dataBreed2.eggColor,
            })
        );

        expect(breeds.data).toHaveLength(1);

        expect(breeds.data[0].eggColor).toBe(dataBreed2.eggColor);
    });

    test("Should filter breeds by purpose", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                breedPurpose: dataBreed1.breedPurpose,
            })
        );

        expect(breeds.data).toHaveLength(1);

        expect(breeds.data[0].breedPurpose).toBe(dataBreed1.breedPurpose);
    });

    test("Should search breeds by name and purpose", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                name: dataBreed1.name,
                breedPurpose: dataBreed1.breedPurpose,
            })
        );

        expect(breeds.data).toHaveLength(1);

        expect(breeds.data[0]).toMatchObject({
            name: dataBreed1.name,
            breedPurpose: dataBreed1.breedPurpose,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid Breed",
            })
        );

        expect(breeds.data).toEqual([]);
    });

    test("Should order breeds by name ascending", async () => {
        const breedB = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "Banana",
        });

        const breedA = await setupBreed(usecaseUser1, {
            ...dataBreed2,
            name: "Apple",
        });

        const breeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedA.uid, breedB.uid]);
    });

    test("Should order breeds by name descending", async () => {
        const breedB = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "Banana",
        });

        const breedA = await setupBreed(usecaseUser1, {
            ...dataBreed2,
            name: "Apple",
        });

        const breeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedB.uid, breedA.uid]);
    });

    test("Should return first page", async () => {
        const [breedA, breedB] = await setupBreeds(
            usecaseUser1,
            dataBreed1,
            dataBreed2,
            {
                ...dataBreed1,
                name: "Breed 3",
            },
            {
                ...dataBreed1,
                name: "Breed 4",
            }
        );

        const breeds = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(breeds.data).toHaveLength(2);

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedA.uid, breedB.uid]);
    });

    test("Should return second page", async () => {
        const [, , breedC, breedD] = await setupBreeds(
            usecaseUser1,
            dataBreed1,
            dataBreed2,
            {
                ...dataBreed1,
                name: "Breed 3",
            },
            {
                ...dataBreed1,
                name: "Breed 4",
            }
        );

        const breeds = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedC.uid, breedD.uid]);
    });

    test("Should return remaining breeds on last page", async () => {
        const [, , , , breedE] = await setupBreeds(
            usecaseUser1,
            dataBreed1,
            dataBreed2,
            {
                ...dataBreed1,
                name: "Breed 3",
            },
            {
                ...dataBreed1,
                name: "Breed 4",
            },
            {
                ...dataBreed1,
                name: "Breed 5",
            }
        );

        const breeds = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupBreeds(usecaseUser1, dataBreed1, dataBreed2);

        const breeds = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(breeds.data).toEqual([]);
    });

    test("Should filter and order breeds", async () => {
        const breedB = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "Banana",
            breedPurpose: BreedPurpose.LAYING,
        });

        const breedA = await setupBreed(usecaseUser1, {
            ...dataBreed2,
            name: "Apple",
            breedPurpose: BreedPurpose.LAYING,
        });

        await setupBreed(usecaseUser1, {
            ...dataBreed2,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
        });

        const breeds = expectSuccess(
            await usecaseUser1.find({
                breedPurpose: BreedPurpose.LAYING,
                orderBy: "name",
                order: "asc",
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedA.uid, breedB.uid]);
    });

    test("Should order before paginate", async () => {
        await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "A",
        });

        await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "B",
        });

        const breedC = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "C",
        });

        const breedD = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "D",
        });

        const breeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedC.uid, breedD.uid]);
    });

    test("Should filter, order and paginate breeds", async () => {
        const breedB = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "Banana",
            breedPurpose: BreedPurpose.LAYING,
        });

        const breedA = await setupBreed(usecaseUser1, {
            ...dataBreed2,
            name: "Apple",
            breedPurpose: BreedPurpose.LAYING,
        });

        await setupBreed(usecaseUser1, {
            ...dataBreed1,
            name: "Orange",
            breedPurpose: BreedPurpose.LAYING,
        });

        const breeds = expectSuccess(
            await usecaseUser1.find({
                breedPurpose: BreedPurpose.LAYING,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(breeds.data.map((breed) => breed.uid)).toEqual([breedA.uid, breedB.uid]);
    });
});
