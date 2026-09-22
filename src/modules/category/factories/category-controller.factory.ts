import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { CategoryController } from "../controller/category.controller";
import { CategoryEntity } from "../entities/category.entity";
import { TypeORMCategoryRepository } from "../repositories/implementations/type-orm-category.repository";
import { CategoryUsecase } from "../usecases/category.usecase";

export function makeCategoryController(context: RequestContext) {
    const categoryRepository = new TypeORMCategoryRepository(
        dataSource.getRepository(CategoryEntity)
    );

    const usecase = new CategoryUsecase(context, categoryRepository);

    return new CategoryController(usecase);
}
