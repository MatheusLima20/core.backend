import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateContentDTO } from "../../../dtos/create-content.dto";
import { ContentUsecase } from "../../content.usecase";

export async function setupContents(usecase: ContentUsecase, ...courses: CreateContentDTO[]) {
    return Promise.all(courses.map((course) => createContentOrFail(usecase, course)));
}

export async function setupContent(usecase: ContentUsecase, course: CreateContentDTO) {
    return createContentOrFail(usecase, course);
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
