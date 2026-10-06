import { AuthUser } from "@/shared/context/auth.user";

import { BreedNotFoundError } from "../../../breed/errors/breed-not-found.error";
import { FlockNotFoundError } from "../../../flock/errors/flock-not-found.error";
import { FlockBreedAlreadyExistsError } from "../../errors/flock-breed-already-exists.error";
import { InvalidFlockBreedQuantityError } from "../../errors/invalid-flock-breed-quantity.error";
import { FlockBreedUsecase } from "../flock-breed.usecase";
import {
    flockBreed1,
    flockBreed2,
    flockBreed4,
    makeFlockBreed,
} from "./factories/flock-breed-data.factory";
import { scenario } from "./setup/flock-breed.builder";
import { expectCreateFlockBreedFailure, setupFlockBreed } from "./setup/flock-breed.setup";

describe("FlockBreedUsecase - create", () => {
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

    test("Should register a flock breed", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed1);

        expect(flockBreed).toMatchObject({
            flockUID: flockBreed1.flockUID,
            breedUID: flockBreed1.breedUID,
            quantity: flockBreed1.quantity,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register flock breeds", async () => {
        const first = await setupFlockBreed(usecaseUser1, flockBreed1);

        const second = await setupFlockBreed(usecaseUser1, flockBreed2);

        const third = await setupFlockBreed(usecaseUser2, flockBreed4);

        expect(first.platformUID).toBe(user1.platformUID);
        expect(second.platformUID).toBe(user1.platformUID);
        expect(third.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same breed in different flocks", async () => {
        await setupFlockBreed(usecaseUser1, flockBreed1);

        await setupFlockBreed(usecaseUser1, {
            ...flockBreed1,
            flockUID: "flk-test-2",
        });
    });

    test("Should allow same flock in different platforms", async () => {
        await setupFlockBreed(usecaseUser1, flockBreed1);

        await setupFlockBreed(usecaseUser2, {
            ...flockBreed4,
            breedUID: flockBreed1.breedUID,
            quantity: flockBreed1.quantity,
        });
    });

    test("Should not register duplicated flock breed", async () => {
        await setupFlockBreed(usecaseUser1, flockBreed1);

        await expectCreateFlockBreedFailure(
            usecaseUser1,
            flockBreed1,
            FlockBreedAlreadyExistsError
        );
    });

    test("Should not register duplicated flock breed ignoring quantity", async () => {
        await setupFlockBreed(usecaseUser1, flockBreed1);

        await expectCreateFlockBreedFailure(
            usecaseUser1,
            makeFlockBreed({
                quantity: 100,
            }),
            FlockBreedAlreadyExistsError
        );
    });

    test("Should register flock breed with another breed", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser1, flockBreed2);

        expect(flockBreed.breedUID).toBe(flockBreed2.breedUID);
    });

    test("Should register flock breed with another flock", async () => {
        const flockBreed = await setupFlockBreed(usecaseUser2, flockBreed4);

        expect(flockBreed.flockUID).toBe(flockBreed4.flockUID);
    });

    test("Should not register flock breed with invalid quantity", async () => {
        await expectCreateFlockBreedFailure(
            usecaseUser1,
            makeFlockBreed({
                quantity: 0,
            }),
            InvalidFlockBreedQuantityError
        );
    });

    test("Should not register flock breed with negative quantity", async () => {
        await expectCreateFlockBreedFailure(
            usecaseUser1,
            makeFlockBreed({
                quantity: -1,
            }),
            InvalidFlockBreedQuantityError
        );
    });

    test("Should not register flock breed with nonexistent flock", async () => {
        await expectCreateFlockBreedFailure(
            usecaseUser1,
            makeFlockBreed({
                flockUID: "flock-not-found",
            }),
            FlockNotFoundError
        );
    });

    test("Should not register flock breed with nonexistent breed", async () => {
        await expectCreateFlockBreedFailure(
            usecaseUser1,
            makeFlockBreed({
                breedUID: "brd-not-found",
            }),
            BreedNotFoundError
        );
    });
});
