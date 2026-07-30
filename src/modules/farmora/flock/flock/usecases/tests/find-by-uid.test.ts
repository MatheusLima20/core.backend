import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockNotFoundError } from "../../errors/flock-not-found.error";
import { FlockUsecase } from "../flock.usecase";
import { activeFlock } from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { setupFlock } from "./setup/flock-tests.setup";

describe("FlockUsecase - findByUID", () => {
    let usecaseUser1!: FlockUsecase;
    let usecaseUser2!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a flock by uid", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser1.findByUID(flock.uid));

        expect(found).toMatchObject({
            uid: flock.uid,

            name: activeFlock.name,

            quantity: activeFlock.quantity,

            birthDate: activeFlock.birthDate,

            arrivalDate: activeFlock.arrivalDate,

            status: activeFlock.status,

            description: activeFlock.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should return FlockNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), FlockNotFoundError);
    });

    test("Should not find a flock from another platform", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        expectFailure(await usecaseUser2.findByUID(flock.uid), FlockNotFoundError);
    });

    test("Should return all persisted flock data", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser1.findByUID(flock.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: flock.uid,

                name: activeFlock.name,

                quantity: activeFlock.quantity,

                birthDate: activeFlock.birthDate,

                arrivalDate: activeFlock.arrivalDate,

                status: activeFlock.status,

                description: activeFlock.description,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});
