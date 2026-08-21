import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreatePlatformDTO } from "../../../dto/create-platform.dto";
import { PlatformUsecase } from "../../platform.usecase";

export async function setupPlatforms(usecase: PlatformUsecase, ...platforms: CreatePlatformDTO[]) {
    return Promise.all(platforms.map((platform) => createPlatformOrFail(usecase, platform)));
}

export async function setupPlatform(usecase: PlatformUsecase, platform: CreatePlatformDTO) {
    return createPlatformOrFail(usecase, platform);
}

async function createPlatformOrFail(usecase: PlatformUsecase, dto: CreatePlatformDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreatePlatformFailure<E extends AppError>(
    usecase: PlatformUsecase,
    dto: CreatePlatformDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
