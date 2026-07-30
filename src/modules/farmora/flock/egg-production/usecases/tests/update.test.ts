import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { UpdateEggProductionDTO } from "../../dtos/update-egg-production.dto";
import { EggProductionNotFoundError } from "../../errors/egg-production-not-found.error";
import { InvalidEggProductionError } from "../../errors/invalid-egg-production.error";
import { EggProductionUsecase } from "../egg-production.usecase";
import { makeEggProduction } from "./factories/egg-production-data.factory";
import { scenario } from "./setup/egg-production.builder";
import { setupEggProduction } from "./setup/egg-production-tests.setup";

describe("EggProductionUsecase - update", () => {
    let usecaseUser1!: EggProductionUsecase;
    let usecaseUser2!: EggProductionUsecase;

    let flockUsecaseUser1!: FlockUsecase;
    //let flockUsecaseUser2!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;
    //let flock2!: Awaited<ReturnType<typeof setupFlocks>>;

    beforeEach(async () => {
        ({
            eggProductionUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        //flock2 = await setupFlock(flockUsecaseUser2, activeFlock);
    });

    test("Should update an egg production", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const data: UpdateEggProductionDTO = {
            uid: production.uid,
            productionDate: new Date("2026-08-01"),
            totalEggs: 100,
            crackedEggs: 5,
            dirtyEggs: 3,
            discardedEggs: 2,
            notes: "Updated production",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: production.uid,

            productionDate: data.productionDate,

            totalEggs: data.totalEggs,

            crackedEggs: data.crackedEggs,

            dirtyEggs: data.dirtyEggs,

            discardedEggs: data.discardedEggs,

            notes: data.notes,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(production.uid));

        expect(found).toMatchObject(updated);

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only total eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                totalEggs: 90,
            })
        );

        expect(updated.totalEggs).toBe(90);
    });

    test("Should update only cracked eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                crackedEggs: 10,
            })
        );

        expect(updated.crackedEggs).toBe(10);
    });

    test("Should update only dirty eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                dirtyEggs: 10,
            })
        );

        expect(updated.dirtyEggs).toBe(10);
    });

    test("Should update only discarded eggs", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                discardedEggs: 5,
            })
        );

        expect(updated.discardedEggs).toBe(5);
    });

    test("Should update only notes", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                notes: "New notes",
            })
        );

        expect(updated.notes).toBe("New notes");
    });

    test("Should remove notes", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
                notes: "Old notes",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: production.uid,
                notes: undefined,
            })
        );

        expect(updated.notes).toBeUndefined();
    });

    test("Should not update production with invalid quantity", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: production.uid,
                totalEggs: flock1.quantity + 1,
            }),
            InvalidEggProductionError
        );
    });

    test("Should not update an inexistent production", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-production",
                totalEggs: 100,
            }),
            EggProductionNotFoundError
        );
    });

    test("Should not update production from another platform", async () => {
        const production = await setupEggProduction(
            usecaseUser1,
            makeEggProduction({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser2.update({
                uid: production.uid,
                totalEggs: 100,
            }),
            EggProductionNotFoundError
        );
    });
});
