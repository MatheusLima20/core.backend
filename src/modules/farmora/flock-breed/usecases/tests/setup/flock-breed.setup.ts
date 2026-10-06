import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateFlockBreedDTO } from "../../../dtos/create-flock-breed.dto";
import { FlockBreedUsecase } from "../../flock-breed.usecase";

export async function setupFlockBreeds(
    usecase: FlockBreedUsecase,
    ...flockBreeds: CreateFlockBreedDTO[]
) {
    return Promise.all(
        flockBreeds.map((flockBreed) => createFlockBreedOrFail(usecase, flockBreed))
    );
}

export async function setupFlockBreed(usecase: FlockBreedUsecase, flockBreed: CreateFlockBreedDTO) {
    return createFlockBreedOrFail(usecase, flockBreed);
}

async function createFlockBreedOrFail(usecase: FlockBreedUsecase, dto: CreateFlockBreedDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateFlockBreedFailure<E extends AppError>(
    usecase: FlockBreedUsecase,
    dto: CreateFlockBreedDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
