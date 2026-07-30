import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateFlockDTO } from "../../dtos/update-flock.dto";
import { FlockStatus } from "../../enums/flock-status.enum";
import { FlockAlreadyExistsError } from "../../errors/flock-already-exists.error";
import { FlockNotFoundError } from "../../errors/flock-not-found.error";
import { FlockUsecase } from "../flock.usecase";
import { activeFlock, closedFlock, makeFlock } from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { setupFlock } from "./setup/flock-tests.setup";

describe("FlockUsecase - update", () => {
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

    test("Should update a flock", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const data: UpdateFlockDTO = {
            uid: flock.uid,
            name: "Lote Atualizado",
            quantity: 180,
            birthDate: new Date("2026-02-01"),
            arrivalDate: new Date("2026-06-01"),
            status: FlockStatus.CLOSED,
            description: "Updated description",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: flock.uid,
            name: data.name,
            quantity: data.quantity,
            birthDate: data.birthDate,
            arrivalDate: data.arrivalDate,
            status: data.status,
            description: data.description,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(flock.uid));

        expect(found).toMatchObject(updated);

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only quantity", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                quantity: 250,
            })
        );

        expect(updated.quantity).toBe(250);
    });

    test("Should update only status", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                status: FlockStatus.CLOSED,
            })
        );

        expect(updated.status).toBe(FlockStatus.CLOSED);
    });

    test("Should update only description", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
    });

    test("Should update only birth date", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const birthDate = new Date("2026-03-15");

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                birthDate,
            })
        );

        expect(updated.birthDate).toEqual(birthDate);
    });

    test("Should update only arrival date", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const arrivalDate = new Date("2026-07-01");

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                arrivalDate,
            })
        );

        expect(updated.arrivalDate).toEqual(arrivalDate);
    });

    test("Should not update duplicated active flock", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const duplicatedActiveFlock = await setupFlock(
            usecaseUser1,
            makeFlock({
                name: "Lote Novo",
                status: FlockStatus.ACTIVE,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: flock.uid,
                name: duplicatedActiveFlock.name,
                status: FlockStatus.ACTIVE,
            }),
            FlockAlreadyExistsError
        );
    });

    test("Should allow updating flock name from closed flock", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        await setupFlock(usecaseUser1, closedFlock);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                name: closedFlock.name,
            })
        );

        expect(updated.name).toBe(closedFlock.name);
    });

    test("Should not update an inexistent flock", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-flock",
                name: "Updated",
            }),
            FlockNotFoundError
        );
    });

    test("Should not update flock from another platform", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        expectFailure(
            await usecaseUser2.update({
                uid: flock.uid,
                name: "Updated",
            }),
            FlockNotFoundError
        );
    });

    test("Should allow updating with the same flock name", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: flock.uid,
                name: activeFlock.name,
            })
        );

        expect(updated.name).toBe(activeFlock.name);
    });

    test("Should not update duplicated flock ignoring case", async () => {
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
                name: "LOTE RECRIA",
            }),
            FlockAlreadyExistsError
        );
    });

    test("Should not update duplicated flock ignoring leading and trailing spaces", async () => {
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
                name: "   Lote Recria   ",
            }),
            FlockAlreadyExistsError
        );
    });

    test("Should not update duplicated flock ignoring case and spaces", async () => {
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
                name: "   LOTE RECRIA   ",
            }),
            FlockAlreadyExistsError
        );
    });
});
