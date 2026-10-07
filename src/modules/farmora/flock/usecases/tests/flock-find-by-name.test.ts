import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../flock.usecase";
import { activeFlock, closedFlock, makeFlock } from "./factories/flock-data.factory";
import { scenario } from "./setup/flock-builder";
import { setupFlock, setupFlocks } from "./setup/flock-tests.setup";

describe("FlockUsecase - findByName", () => {
    let usecaseUser1!: FlockUsecase;
    let usecaseUser2!: FlockUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find flocks by name", async () => {
        await setupFlocks(
            usecaseUser1,
            activeFlock,
            makeFlock({
                name: activeFlock.name,
                status: closedFlock.status,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByName(activeFlock.name));

        expect(found).toHaveLength(2);

        expect(found).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: activeFlock.name,
                }),
            ])
        );
    });

    test("Should find flock ignoring case", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser1.findByName(activeFlock.name.toUpperCase()));

        expect(found).toHaveLength(1);

        expect(found[0].name).toBe(activeFlock.name);
    });

    test("Should find flock ignoring leading and trailing spaces", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser1.findByName(`   ${activeFlock.name}   `));

        expect(found).toHaveLength(1);

        expect(found[0].name).toBe(activeFlock.name);
    });

    test("Should return empty array when flock does not exist", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser1.findByName("Hy-Line Brown"));

        expect(found).toHaveLength(0);
    });

    test("Should not find flock from another platform", async () => {
        await setupFlock(usecaseUser1, activeFlock);

        const found = expectSuccess(await usecaseUser2.findByName(activeFlock.name));

        expect(found).toHaveLength(0);
    });

    test("Should find active and closed flocks with same name", async () => {
        await setupFlocks(
            usecaseUser1,
            activeFlock,
            makeFlock({
                name: activeFlock.name,
                status: closedFlock.status,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByName(activeFlock.name));

        expect(found).toHaveLength(2);

        expect(found.map((flock) => flock.status)).toEqual(
            expect.arrayContaining([activeFlock.status, closedFlock.status])
        );
    });
});
