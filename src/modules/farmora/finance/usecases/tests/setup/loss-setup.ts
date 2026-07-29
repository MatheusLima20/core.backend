import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateLossDTO } from "../../../dtos/create-loss.dto";
import { LossUsecase } from "../../loss.usecase";

export async function setupLosses(usecase: LossUsecase, ...losses: CreateLossDTO[]) {
    return Promise.all(losses.map((loss) => createLossOrFail(usecase, loss)));
}

export async function setupLoss(usecase: LossUsecase, loss: CreateLossDTO) {
    return createLossOrFail(usecase, loss);
}

async function createLossOrFail(usecase: LossUsecase, dto: CreateLossDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateLossFailure<E extends AppError>(
    usecase: LossUsecase,
    dto: CreateLossDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
