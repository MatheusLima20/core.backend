import { ProductEntity } from "@/modules/product/entities/product.entity";
import { TypeORMProductRepository } from "@/modules/product/repositories/implementations/type-orm-product.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { StockController } from "../controller/stock.controller";
import { StockEntity } from "../entities/stock.entity";
import { TypeORMStockRepository } from "../repositories/implementations/type-orm-product.repository";
import { StockUsecase } from "../usecases/stock.usecase";

export function makeStockController(context: RequestContext) {
    const stockRepository = new TypeORMStockRepository(dataSource.getRepository(StockEntity));

    const productRepository = new TypeORMProductRepository(dataSource.getRepository(ProductEntity));

    const usecase = new StockUsecase(context, stockRepository, productRepository);

    return new StockController(usecase);
}
