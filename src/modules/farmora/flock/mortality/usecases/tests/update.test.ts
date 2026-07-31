import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { UpdateMortalityDTO } from "../../dtos/update-mortality.dto";
import { MortalityCause } from "../../enums/mortality-cause.enum";
import { InvalidMortalityError } from "../../errors/invalid-mortality.error";
import { MortalityNotFoundError } from "../../errors/mortality-not-found.error";
import { MortalityUsecase } from "../mortality.usecase";
import { makeMortality } from "./factories/mortality.factory";
import { setupMortality } from "./setup/setup-mortality";
import { scenario } from "./setup/test-builder";

describe("MortalityUsecase - update", () => {
    let usecaseUser1!: MortalityUsecase;
    let usecaseUser2!: MortalityUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    beforeEach(async () => {
        ({
            mortalityUsecases: [usecaseUser1, usecaseUser2],
            flockUsecases: [flockUsecaseUser1],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);
    });

    test("Should update a mortality", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const data: UpdateMortalityDTO = {
            uid: mortality.uid,
            mortalityDate: new Date("2026-08-01"),
            quantity: 5,
            cause: mortality.cause,
            notes: "Updated mortality",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: mortality.uid,

            mortalityDate: data.mortalityDate,

            quantity: data.quantity,

            cause: data.cause,

            notes: data.notes,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(mortality.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only quantity", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: mortality.uid,
                quantity: 7,
            })
        );

        expect(updated.quantity).toBe(7);
    });

    test("Should update only cause", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: mortality.uid,
                cause: MortalityCause.DISEASE,
            })
        );

        expect(updated.cause).toBe(MortalityCause.DISEASE);
    });

    test("Should update only notes", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: mortality.uid,
                notes: "New notes",
            })
        );

        expect(updated.notes).toBe("New notes");
    });

    test("Should remove notes", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
                notes: "Old notes",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: mortality.uid,
                notes: undefined,
            })
        );

        expect(updated.notes).toBeUndefined();
    });

    test("Should not update mortality with invalid quantity", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: mortality.uid,
                flockUID: flock1.uid,
                quantity: flock1.quantity + 1,
            }),
            InvalidMortalityError
        );
    });

    test("Should not update an inexistent mortality", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-mortality",
                quantity: 5,
            }),
            MortalityNotFoundError
        );
    });

    test("Should not update mortality from another platform", async () => {
        const mortality = await setupMortality(
            usecaseUser1,
            makeMortality({
                flockUID: flock1.uid,
            })
        );

        expectFailure(
            await usecaseUser2.update({
                uid: mortality.uid,
                quantity: 5,
            }),
            MortalityNotFoundError
        );
    });
});
