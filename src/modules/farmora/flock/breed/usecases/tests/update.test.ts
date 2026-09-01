import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateBreedDTO } from "../../dtos/update-breed.dto";
import { BreedPurpose } from "../../enums/breed-origin.enum";
import { EggColor } from "../../enums/egg-color.enum";
import { BreedAlreadyExistsError } from "../../errors/breed-already-exists.error";
import { BreedNotFoundError } from "../../errors/breed-not-found.error";
import { BreedUsecase } from "../breed.usecase";
import { dataBreed1, dataBreed2 } from "./factories/breed-data.factory";
import { scenario } from "./setup/breed.builder";
import { setupBreed } from "./setup/breed-tests.setup";

describe("BreedUsecase - update", () => {
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

    test("Should update a breed", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const data: UpdateBreedDTO = {
            uid: breed.uid,
            name: "Isa Brown Updated",
            scientificName: "Gallus gallus domestics",
            eggColor: EggColor.WHITE,
            breedPurpose: BreedPurpose.DUAL_PURPOSE,
            description: "Updated description",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: breed.uid,
            name: data.name,
            scientificName: data.scientificName,
            eggColor: data.eggColor,
            breedPurpose: data.breedPurpose,
            description: data.description,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(breed.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only description", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
    });

    test("Should update only egg color", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed.uid,
                eggColor: EggColor.BLUE,
            })
        );

        expect(updated.eggColor).toBe(EggColor.BLUE);
    });

    test("Should update only breed purpose", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed.uid,
                breedPurpose: BreedPurpose.DUAL_PURPOSE,
            })
        );

        expect(updated.breedPurpose).toBe(BreedPurpose.DUAL_PURPOSE);
    });

    test("Should not update duplicated breed", async () => {
        const breed1 = await setupBreed(usecaseUser1, dataBreed1);

        await setupBreed(usecaseUser1, dataBreed2);

        expectFailure(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: breed1.uid,
                name: dataBreed2.name,
            }),
            BreedAlreadyExistsError
        );
    });

    test("Should not update an inexistent breed", async () => {
        expectFailure(
            await usecaseUser1.update({
                ...dataBreed1,
                uid: "invalid-breed",
            }),
            BreedNotFoundError
        );
    });

    test("Should not update breed from another platform", async () => {
        const breed = await setupBreed(usecaseUser1, dataBreed1);

        expectFailure(
            await usecaseUser2.update({
                ...dataBreed1,
                uid: breed.uid,
                name: "Updated",
            }),
            BreedNotFoundError
        );
    });
});
