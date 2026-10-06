import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateEggProductionDTO } from "../../../dtos/create-egg-production.dto";
import { EggProductionUsecase } from "../../egg-production.usecase";

export async function setupEggProductions(
    usecase: EggProductionUsecase,
    ...productions: CreateEggProductionDTO[]
) {
    return Promise.all(
        productions.map((production) => createEggProductionOrFail(usecase, production))
    );
}

export async function setupEggProduction(
    usecase: EggProductionUsecase,
    production: CreateEggProductionDTO
) {
    return createEggProductionOrFail(usecase, production);
}

async function createEggProductionOrFail(
    usecase: EggProductionUsecase,
    dto: CreateEggProductionDTO
) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateEggProductionFailure<E extends AppError>(
    usecase: EggProductionUsecase,
    dto: CreateEggProductionDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
