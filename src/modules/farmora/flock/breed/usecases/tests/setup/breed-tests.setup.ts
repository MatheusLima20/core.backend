import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateBreedDTO } from "../../../dtos/create-breed.dto";
import { BreedUsecase } from "../../breed.usecase";

export async function setupBreeds(usecase: BreedUsecase, ...breeds: CreateBreedDTO[]) {
    return Promise.all(breeds.map((breed) => createBreedOrFail(usecase, breed)));
}

export async function setupBreed(usecase: BreedUsecase, breed: CreateBreedDTO) {
    return createBreedOrFail(usecase, breed);
}

async function createBreedOrFail(usecase: BreedUsecase, dto: CreateBreedDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateBreedFailure<E extends AppError>(
    usecase: BreedUsecase,
    dto: CreateBreedDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
