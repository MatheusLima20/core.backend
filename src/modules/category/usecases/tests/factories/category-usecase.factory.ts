import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryCategoryRepository } from "../../../repositories/implementations/in-memory-category.repository";
import { CategoryUsecase } from "../../category.usecase";

export function makeCategoryUsecase(
    user: AuthUser,
    categoryRepository: InMemoryCategoryRepository
) {
    const context = { user };

    return {
        usecase: new CategoryUsecase(context, categoryRepository),
    };
}
