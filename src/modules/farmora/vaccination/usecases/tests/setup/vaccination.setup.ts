import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateVaccinationDTO } from "../../../dtos/create-vaccination.dto";
import { VaccinationUsecase } from "../../vaccination.usecase";

export async function setupVaccinations(
    usecase: VaccinationUsecase,
    ...vaccinations: CreateVaccinationDTO[]
) {
    return Promise.all(
        vaccinations.map((vaccination) => createVaccinationOrFail(usecase, vaccination))
    );
}

export async function setupVaccination(
    usecase: VaccinationUsecase,
    vaccination: CreateVaccinationDTO
) {
    return createVaccinationOrFail(usecase, vaccination);
}

async function createVaccinationOrFail(usecase: VaccinationUsecase, dto: CreateVaccinationDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateVaccinationFailure<E extends AppError>(
    usecase: VaccinationUsecase,
    dto: CreateVaccinationDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
