import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { BreedNotFoundError } from "../../errors/breed-not-found.error";
import { BreedUsecase } from "../breed.usecase";
import { dataBreed1 } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { setupBreed } from "./setup/breed-tests.setup";

describe("BreedUsecase - findByUID", () => {
    let usecaseUser1!: BreedUsecase;
    let usecaseUser2!: BreedUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a breed by uid", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const found = expectSuccess(await usecaseUser1.findByUID(breed.uid));

        expect(found).toMatchObject({
            uid: breed.uid,

            name: dataBreed1.name,

            scientificName: dataBreed1.scientificName,

            eggColor: dataBreed1.eggColor,

            breedPurpose: dataBreed1.breedPurpose,

            description: dataBreed1.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should return BreedNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), BreedNotFoundError);
    });

    test("Should not find a breed from another platform", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        expectFailure(await usecaseUser2.findByUID(breed.uid), BreedNotFoundError);
    });

    test("Should return all persisted breed data", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const found = expectSuccess(await usecaseUser1.findByUID(breed.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: breed.uid,

                name: dataBreed1.name,

                scientificName: dataBreed1.scientificName,

                eggColor: dataBreed1.eggColor,

                breedPurpose: dataBreed1.breedPurpose,

                description: dataBreed1.description,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});
