import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateCategoryDTO } from "../../../dtos/create-category.dto";
import { CategoryUsecase } from "../../category.usecase";

export async function setupCategories(
    usecase: CategoryUsecase,
    ...categories: CreateCategoryDTO[]
) {
    return Promise.all(categories.map((category) => createCategoryOrFail(usecase, category)));
}

export async function setupCategory(usecase: CategoryUsecase, category: CreateCategoryDTO) {
    return createCategoryOrFail(usecase, category);
}

async function createCategoryOrFail(usecase: CategoryUsecase, dto: CreateCategoryDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateCategoryFailure<E extends AppError>(
    usecase: CategoryUsecase,
    dto: CreateCategoryDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
