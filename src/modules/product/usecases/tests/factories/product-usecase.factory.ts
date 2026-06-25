import { InMemoryProductRepository } from "@/modules/product/repositories/implementations/in-memory-product.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { ProductUsecase } from "../../product.usecase";

export function makeProductUsecase(
    user: AuthUser,
    productRepository: InMemoryProductRepository,
) {
    const context = { user };

    return {
        usecase: new ProductUsecase(context, productRepository),
    };
}
