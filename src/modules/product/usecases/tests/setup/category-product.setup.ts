import { CreateCategoryDTO } from "@/modules/category/dtos/create-category.dto";
import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { expectSuccess } from "@/shared/tests/result.helper";

export async function setupProductCategory(usecase: CategoryUsecase, data: CreateCategoryDTO) {
    return expectSuccess(await usecase.create(data));
}
