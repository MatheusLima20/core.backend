import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { MortalityNotFoundError } from "../../errors/mortality-not-found.error";
import { MortalityUsecase } from "../mortality.usecase";
import { makeMortality, mortality1, mortality2, mortality3 } from "./factories/mortality.factory";
import { setupMortalities, setupMortality } from "./setup/setup-mortality";
import { scenario } from "./setup/test-builder";

describe("MortalityUsecase - delete", () => {
    let usecaseUser1!: MortalityUsecase;
    let usecaseUser2!: MortalityUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            mortalityUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);
    });

    test("Should delete a mortality", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(mortality.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before.data).toHaveLength(1);

        expect(after.data).toHaveLength(0);

        const find = expectSuccess(await usecaseUser1.findByUID(mortality.uid));

        expect(find).toBe(null);
    });

    test("Should delete only selected mortality", async () => {
        const [mortalityA, mortalityB] = await setupMortalities(
            usecaseUser1,
            makeMortality({
                ...mortality1,
                flockUID: flock1.uid,
            }),
            makeMortality({
                ...mortality2,
                flockUID: flock1.uid,
            })
        );

        expectSuccess(await usecaseUser1.delete(mortalityA.uid));

        const deleted = expectSuccess(await usecaseUser1.findByUID(mortalityA.uid));

        expect(deleted).toBe(null);

        const remaining = expectSuccess(await usecaseUser1.findByUID(mortalityB.uid));

        expect(remaining?.uid).toBe(mortalityB.uid);
    });

    test("Should not delete an inexistent mortality", async () => {
        expectFailure(await usecaseUser1.delete("invalid-mortality"), MortalityNotFoundError);
    });

    test("Should not delete mortality from another platform", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        expectFailure(await usecaseUser2.delete(mortality.uid), MortalityNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(mortality.uid));
    });

    test("Should not delete mortality from another platform without affecting data", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const user2Mortalities = expectSuccess(await usecaseUser2.find());

        expect(user2Mortalities.data).toHaveLength(0);

        expectFailure(await usecaseUser2.delete(mortality.uid), MortalityNotFoundError);

        const user1Mortalities = expectSuccess(await usecaseUser1.find());

        expect(user1Mortalities.data).toHaveLength(1);

        expect(user1Mortalities.data[0].uid).toBe(mortality.uid);
    });

    test("Should delete one mortality keeping remaining mortalities", async () => {
        const [mortalityA, mortalityB, mortalityC] = await setupMortalities(
            usecaseUser1,
            makeMortality({
                ...mortality1,
                flockUID: flock1.uid,
            }),
            makeMortality({
                ...mortality2,
                flockUID: flock1.uid,
            }),
            makeMortality({
                ...mortality3,
                flockUID: flock1.uid,
            })
        );

        expectSuccess(await usecaseUser1.delete(mortalityB.uid));

        const mortalities = expectSuccess(await usecaseUser1.find());

        expect(mortalities.data).toHaveLength(2);

        expect(mortalities.data.map((mortality) => mortality.uid)).toEqual(
            expect.arrayContaining([mortalityA.uid, mortalityC.uid])
        );

        const deleted = expectSuccess(await usecaseUser1.findByUID(mortalityB.uid));

        expect(deleted).toBe(null);
    });
});
