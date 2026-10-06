import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateMortalityDTO } from "../../../dtos/create-mortality.dto";
import { MortalityUsecase } from "../../mortality.usecase";

export async function setupMortalities(
    usecase: MortalityUsecase,
    ...mortalities: CreateMortalityDTO[]
) {
    return Promise.all(mortalities.map((mortality) => createMortalityOrFail(usecase, mortality)));
}

export async function setupMortality(usecase: MortalityUsecase, mortality: CreateMortalityDTO) {
    return createMortalityOrFail(usecase, mortality);
}

async function createMortalityOrFail(usecase: MortalityUsecase, dto: CreateMortalityDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateMortalityFailure<E extends AppError>(
    usecase: MortalityUsecase,
    dto: CreateMortalityDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
