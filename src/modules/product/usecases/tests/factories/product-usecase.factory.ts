import { ProductUsecase } from "../../product.usecase";
import { AuthUser } from "@/shared/context/auth.user";
import { InMemoryProductRepository } from "@/modules/product/repositories/implementations/in-memory-product.repository";

export function makeProductUsecase(
    user: AuthUser,
    productRepository: InMemoryProductRepository,
) {
    const context = { user };

    return {
        usecase: new ProductUsecase(context, productRepository),
    };
}
