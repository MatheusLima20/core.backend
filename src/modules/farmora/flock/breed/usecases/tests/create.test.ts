import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure } from "@/shared/tests/result.helper";

import { BreedPurpose } from "../../enums/breed-origin.enum";
import { EggColor } from "../../enums/egg-color.enum";
import { BreedAlreadyExistsError } from "../../errors/breed-already-exists.error";
import { BreedUsecase } from "../breed.usecase";
import { dataBreed1, dataBreed2 } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { expectCreateBreedFailure, setupBreed } from "./setup/breed-tests.setup";

describe("BreedUsecase - create", () => {
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

    test("Should register a breed", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        expect(breed).toMatchObject({
            name: dataBreed1.name,
            scientificName: dataBreed1.scientificName,
            eggColor: dataBreed1.eggColor,
            breedPurpose: dataBreed1.breedPurpose,
            description: dataBreed1.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should register breeds", async () => {
        const breed1 = await setupBreed(usecaseUser1, dataBreed1);

        const breed2 = await setupBreed(usecaseUser2, dataBreed2);

        expect(breed1.platformUID).toBe(user1.platformUID);

        expect(breed2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same breed in different platforms", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        await setupBreed(usecaseUser2, dataBreed1);
    });

    test("Should not register duplicated breed", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        await expectCreateBreedFailure(usecaseUser1, dataBreed1, BreedAlreadyExistsError);
    });

    test("Should register laying breed", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            breedPurpose: BreedPurpose.LAYING,
        });

        expect(breed.breedPurpose).toBe(BreedPurpose.LAYING);
    });

    test("Should register dual purpose breed", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
        });

        expect(breed.breedPurpose).toBe(BreedPurpose.DUAL_PURPOSE);
    });

    test("Should register breed with brown eggs", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            eggColor: EggColor.BROWN,
        });

        expect(breed.eggColor).toBe(EggColor.BROWN);
    });

    test("Should register breed with blue eggs", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            eggColor: EggColor.BLUE,
        });

        expect(breed.eggColor).toBe(EggColor.BLUE);
    });

    test("Should register breed without description", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            description: undefined,
        });

        expect(breed.description).toBeUndefined();
    });

    test("Should register breed without scientific name", async () => {
        const breed = await setupBreed(usecaseUser1, {
            ...dataBreed1,
            scientificName: undefined,
        });

        expect(breed.scientificName).toBeUndefined();
    });

    test("Should not register duplicated breed ignoring case", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        await expectCreateBreedFailure(
            usecaseUser1,
            {
                ...dataBreed1,
                name: dataBreed1.name.toUpperCase(),
            },
            BreedAlreadyExistsError
        );
    });

    test("Should not register duplicated breed ignoring leading and trailing spaces", async () => {
        await setupBreed(usecaseUser1, dataBreed1);

        await expectCreateBreedFailure(
            usecaseUser1,
            {
                ...dataBreed1,
                name: `   ${dataBreed1.name}   `,
            },
            BreedAlreadyExistsError
        );
    });

    test("Should not update breed name ignoring case", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        await setupBreed(usecaseUser1, dataBreed2);

        expectFailure(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed.uid,
                name: dataBreed2.name.toUpperCase(),
            }),
            BreedAlreadyExistsError
        );
    });

    test("Should not update breed name ignoring leading and trailing spaces", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        await setupBreed(usecaseUser1, dataBreed2);

        expectFailure(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed.uid,
                name: `   ${dataBreed2.name}   `,
            }),
            BreedAlreadyExistsError
        );
    });
});
