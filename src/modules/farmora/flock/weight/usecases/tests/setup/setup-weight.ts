import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateWeightDTO } from "../../../dtos/create-weight.dto";
import { WeightUsecase } from "../../weight.usecase";

export async function setupWeights(usecase: WeightUsecase, ...weights: CreateWeightDTO[]) {
    return Promise.all(weights.map((weight) => createWeightOrFail(usecase, weight)));
}

export async function setupWeight(usecase: WeightUsecase, weight: CreateWeightDTO) {
    return createWeightOrFail(usecase, weight);
}

async function createWeightOrFail(usecase: WeightUsecase, dto: CreateWeightDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateWeightFailure<E extends AppError>(
    usecase: WeightUsecase,
    dto: CreateWeightDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
