import { AuthUser } from "@/shared/context/auth.user";
import { InMemoryProductRepository } from "../../repositories/implementations/in-memory-product.repository";
import { RequestContext } from "@/shared/context/request-context";
import { ProductUsecase } from "../product.usecase";

export function makeProductUsecase(
    user: AuthUser,
    productRepository: InMemoryProductRepository,
) {
    const context: RequestContext = { user };

    const usecase = new ProductUsecase(context, productRepository);

    return {
        usecase,
        productRepository,
    };
}
