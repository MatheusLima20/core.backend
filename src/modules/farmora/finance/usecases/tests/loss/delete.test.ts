import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { LossNotFoundError } from "../../../errors/loss-not-found.error";
import { LossUsecase } from "../../loss.usecase";
import { dataLoss1 } from "../factories/loss-data.factory";
import { scenario } from "../setup/loss.builder";
import { setupLoss } from "../setup/loss-setup";

describe("LossUsecase - delete", () => {
    let usecase!: LossUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecase],
        } = (await scenario().loadUsers(["1"])).createUsecases().build());
    });

    test("Should delete a loss", async () => {
        const loss = await setupLoss(usecase, dataLoss1);

        expectSuccess(await usecase.delete(loss.uid));

        expectFailure(await usecase.findByUID(loss.uid), LossNotFoundError);
    });

    test("Should return LossNotFoundError when deleting non-existent loss", async () => {
        expectFailure(await usecase.delete("invalid-uid"), LossNotFoundError);
    });

    test("Should not delete the same loss twice", async () => {
        const loss = await setupLoss(usecase, dataLoss1);

        expectSuccess(await usecase.delete(loss.uid));

        expectFailure(await usecase.delete(loss.uid), LossNotFoundError);
    });
});
