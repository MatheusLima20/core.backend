import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockBreedUsecase } from "../flock-breed.usecase";
import { flockBreed1 } from "./factories/flock-breed-data.factory";
import { scenario } from "./setup/flock-breed.builder";
import { setupFlockBreed } from "./setup/flock-breed.setup";

describe("FlockBreedUsecase - findByUID", () => {
    let usecaseUser1!: FlockBreedUsecase;
    let usecaseUser2!: FlockBreedUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            flockBreedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a flock breed by uid", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const found = expectSuccess(await usecaseUser1.findByUID(flockBreed.uid));

        expect(found).toMatchObject({
            uid: flockBreed.uid,

            flockUID: flockBreed1.flockUID,

            breedUID: flockBreed1.breedUID,

            quantity: flockBreed1.quantity,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const find = expectSuccess(await usecaseUser1.findByUID("invalid-flock-breed"));

        expect(find).toBe(null);
    });

    test("Should not find a flock breed from another platform", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const find = expectSuccess(await usecaseUser2.findByUID(flockBreed.uid));

        expect(find).toBe(null);
    });

    test("Should return all persisted flock breed data", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const found = expectSuccess(await usecaseUser1.findByUID(flockBreed.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: flockBreed.uid,

                flockUID: flockBreed1.flockUID,

                breedUID: flockBreed1.breedUID,

                quantity: flockBreed1.quantity,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });
});
