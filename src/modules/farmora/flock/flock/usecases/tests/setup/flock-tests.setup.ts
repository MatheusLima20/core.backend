import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateFlockDTO } from "../../../dtos/create-flock.dto";
import { FlockUsecase } from "../../flock.usecase";

export async function setupFlocks(usecase: FlockUsecase, ...flocks: CreateFlockDTO[]) {
    return Promise.all(flocks.map((flock) => createFlockOrFail(usecase, flock)));
}

export async function setupFlock(usecase: FlockUsecase, flock: CreateFlockDTO) {
    return createFlockOrFail(usecase, flock);
}

async function createFlockOrFail(usecase: FlockUsecase, dto: CreateFlockDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateFlockFailure<E extends AppError>(
    usecase: FlockUsecase,
    dto: CreateFlockDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
