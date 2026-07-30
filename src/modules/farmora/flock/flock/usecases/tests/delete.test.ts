import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockNotFoundError } from "../../errors/flock-not-found.error";
import { FlockUsecase } from "../flock.usecase";
import { activeFlock, closedFlock, makeFlock } from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { setupFlock, setupFlocks } from "./setup/flock-tests.setup";

describe("FlockUsecase - delete", () => {
    let usecaseUser1!: FlockUsecase;
    let usecaseUser2!: FlockUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a flock", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(flock.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(flock.uid), FlockNotFoundError);
    });

    test("Should delete only selected flock", async () => {
        const [flockA, flockB] = await setupFlocks(usecaseUser1, activeFlock, closedFlock);

        expectSuccess(await usecaseUser1.delete(flockA.uid));

        expectFailure(await usecaseUser1.findByUID(flockA.uid), FlockNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(flockB.uid));

        expect(remaining.uid).toBe(flockB.uid);
    });

    test("Should not delete an inexistent flock", async () => {
        expectFailure(await usecaseUser1.delete("invalid-flock"), FlockNotFoundError);
    });

    test("Should not delete flock from another platform", async () => {
        const flock = await setupFlock(usecaseUser1, activeFlock);

        expectFailure(await usecaseUser2.delete(flock.uid), FlockNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(flock.uid));
    });

    test("Should delete one flock keeping remaining flocks", async () => {
        const [flockA, flockB, flockC] = await setupFlocks(
            usecaseUser1,
            activeFlock,
            closedFlock,
            makeFlock({
                name: "Lote Recria",
            })
        );

        expectSuccess(await usecaseUser1.delete(flockB.uid));

        const flocks = expectSuccess(await usecaseUser1.find());

        expect(flocks).toHaveLength(2);

        expect(flocks.map((flock) => flock.uid)).toEqual(
            expect.arrayContaining([flockA.uid, flockC.uid])
        );

        expectFailure(await usecaseUser1.findByUID(flockB.uid), FlockNotFoundError);
    });

    test("Should delete closed flock", async () => {
        const flock = await setupFlock(usecaseUser1, closedFlock);

        expectSuccess(await usecaseUser1.delete(flock.uid));

        expectFailure(await usecaseUser1.findByUID(flock.uid), FlockNotFoundError);
    });
});
