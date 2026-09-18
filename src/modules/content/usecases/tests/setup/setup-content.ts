import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateContentDTO } from "../../../dtos/create-content.dto";
import { ContentUsecase } from "../../content.usecase";

export async function setupContents(usecase: ContentUsecase, ...contents: CreateContentDTO[]) {
    return Promise.all(contents.map((content) => createContentOrFail(usecase, content)));
}

export async function setupContent(usecase: ContentUsecase, content: CreateContentDTO) {
    return createContentOrFail(usecase, content);
}

async function createContentOrFail(usecase: ContentUsecase, dto: CreateContentDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateContentFailure<E extends AppError>(
    usecase: ContentUsecase,
    dto: CreateContentDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
