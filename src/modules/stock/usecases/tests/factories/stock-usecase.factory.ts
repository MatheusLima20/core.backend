import { InMemoryProductRepository } from "@/modules/product/repositories/implementations/in-memory-product.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryStockRepository } from "../../../repositories/implementations/in-memory-stock.repository";
import { StockUsecase } from "../../stock.usecase";

export function makeStockUsecase(
    user: AuthUser,
    stockRepository: InMemoryStockRepository,
    productRepository: InMemoryProductRepository
) {
    const context = { user };

    return {
        usecase: new StockUsecase(context, stockRepository, productRepository),
    };
}
