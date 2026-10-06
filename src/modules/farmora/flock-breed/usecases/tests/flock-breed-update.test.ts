import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockBreedNotFoundError } from "../../errors/flock-breed-not-found.error";
import { InvalidFlockBreedQuantityError } from "../../errors/invalid-flock-breed-quantity.error";
import { FlockBreedUsecase } from "../flock-breed.usecase";
import { flockBreed1 } from "./factories/flock-breed-data.factory";
import { scenario } from "./setup/flock-breed.builder";
import { setupFlockBreed } from "./setup/flock-breed.setup";

describe("FlockBreedUsecase - update", () => {
    let usecaseUser1!: FlockBreedUsecase;
    let usecaseUser2!: FlockBreedUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            flockBreedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should update a flock breed", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: 60,
            })
        );

        expect(updated).toMatchObject({
            uid: flockBreed.uid,
            flockUID: flockBreed.flockUID,
            breedUID: flockBreed.breedUID,
            quantity: 60,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(flockBreed.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only quantity", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: 75,
            })
        );

        expect(updated.quantity).toBe(75);
    });

    test("Should keep flock and breed unchanged", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: 80,
            })
        );

        expect(updated.flockUID).toBe(flockBreed.flockUID);
        expect(updated.breedUID).toBe(flockBreed.breedUID);
    });

    test("Should allow updating with the same quantity", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: flockBreed1.quantity,
            })
        );

        expect(updated.quantity).toBe(flockBreed1.quantity);
    });

    test("Should not update with zero quantity", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        expectFailure(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: 0,
            }),
            InvalidFlockBreedQuantityError
        );
    });

    test("Should not update with negative quantity", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        expectFailure(
            await usecaseUser1.update({
                uid: flockBreed.uid,
                quantity: -10,
            }),
            InvalidFlockBreedQuantityError
        );
    });

    test("Should not update an inexistent flock breed", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-flock-breed",
                quantity: 50,
            }),
            FlockBreedNotFoundError
        );
    });

    test("Should not update flock breed from another platform", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        expectFailure(
            await usecaseUser2.update({
                uid: flockBreed.uid,
                quantity: 50,
            }),
            FlockBreedNotFoundError
        );
    });
});
