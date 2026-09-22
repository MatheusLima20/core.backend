import { InMemoryCategoryRepository } from "@/modules/category/repositories/implementations/in-memory-category.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryProductRepository } from "../../../repositories/implementations/in-memory-product.repository";
import { ProductUsecase } from "../../product.usecase";

export function makeProductUsecase(
    user: AuthUser,
    productRepository: InMemoryProductRepository,
    categoryRepository: InMemoryCategoryRepository
) {
    const context = { user };

    return {
        usecase: new ProductUsecase(context, productRepository, categoryRepository),
    };
}
