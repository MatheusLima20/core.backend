import { CategoryEntity } from "@/modules/category/entities/category.entity";
import { TypeORMCategoryRepository } from "@/modules/category/repositories/implementations/type-orm-category.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { ProductController } from "../controller/product.controller";
import { ProductEntity } from "../entities/product.entity";
import { TypeORMProductRepository } from "../repositories/implementations/type-orm-product.repository";
import { ProductUsecase } from "../usecases/product.usecase";

export function makeProductController(context: RequestContext) {
    const productRepository = new TypeORMProductRepository(dataSource.getRepository(ProductEntity));

    const categoryRepository = new TypeORMCategoryRepository(
        dataSource.getRepository(CategoryEntity)
    );

    const usecase = new ProductUsecase(context, productRepository, categoryRepository);

    return new ProductController(usecase);
}
