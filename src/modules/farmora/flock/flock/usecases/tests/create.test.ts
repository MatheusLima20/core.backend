import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockStatus } from "../../enums/flock-status.enum";
import { FlockAlreadyExistsError } from "../../errors/flock-already-exists.error";
import { FlockUsecase } from "../flock.usecase";
import { activeFlock, closedFlock, makeFlock } from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { expectCreateFlockFailure, setupFlock } from "./setup/flock-tests.setup";

describe("FlockUsecase - create", () => {
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

    test("Should register a flock", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        expect(flock).toMatchObject({
            name: activeFlock.name,
            quantity: activeFlock.quantity,
            birthDate: activeFlock.birthDate,
            arrivalDate: activeFlock.arrivalDate,
            status: activeFlock.status,
            description: activeFlock.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register flocks", async () => {
        const flock1 = await setupFlock(usecaseUser1, activeFlock);

        const flock2 = await setupFlock(usecaseUser2, closedFlock);

        expect(flock1.platformUID).toBe(user1.platformUID);

        expect(flock2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same flock name in different platforms", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        await setupFlock(usecaseUser2, activeFlock);
    });

    test("Should not register duplicated flock", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        await expectCreateFlockFailure(usecaseUser1, activeFlock, FlockAlreadyExistsError);
    });

    test("Should register active flock", async () => {
        const flock = await setupFlock(usecaseUser1, {
            ...activeFlock,
            status: FlockStatus.ACTIVE,
        });

        expect(flock.status).toBe(FlockStatus.ACTIVE);
    });

    test("Should register closed flock", async () => {
        const flock = await setupFlock(usecaseUser1, {
            ...activeFlock,
            status: FlockStatus.CLOSED,
        });

        expect(flock.status).toBe(FlockStatus.CLOSED);
    });

    test("Should register flock without description", async () => {
        const flock = await setupFlock(usecaseUser1, {
            ...activeFlock,
            description: undefined,
        });

        expect(flock.description).toBeUndefined();
    });

    test("Should not register duplicated flock ignoring case", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        await expectCreateFlockFailure(
            usecaseUser1,
            {
                ...activeFlock,
                name: activeFlock.name.toUpperCase(),
            },
            FlockAlreadyExistsError
        );
    });

    test("Should not register duplicated flock ignoring leading and trailing spaces", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        await expectCreateFlockFailure(
            usecaseUser1,
            {
                ...activeFlock,
                name: `   ${activeFlock.name}   `,
            },
            FlockAlreadyExistsError
        );
    });

    test("Should not update flock name ignoring case", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        await setupFlock(
            usecaseUser1,
            makeFlock({
                name: "Lote Recria",
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: flock.uid,
                ...activeFlock,
                name: "LOTE RECRIA",
            }),
            FlockAlreadyExistsError
        );
    });

    test("Should not update flock name ignoring leading and trailing spaces", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        await setupFlock(
            usecaseUser1,
            makeFlock({
                name: "Lote Recria",
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: flock.uid,
                ...activeFlock,
                name: "   Lote Recria   ",
            }),
            FlockAlreadyExistsError
        );
    });

    test("Should not register duplicated flock with different casing and spaces", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        await expectCreateFlockFailure(
            usecaseUser1,
            {
                ...activeFlock,
                name: `   ${activeFlock.name.toUpperCase()}   `,
            },
            FlockAlreadyExistsError
        );
    });
});
