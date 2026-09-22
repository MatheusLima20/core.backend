import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindProductsDTO } from "../dtos/find-products.dto";
import { ProductEntity } from "../entities/product.entity";

export interface IProductRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<ProductEntity | null>>;

    find(
        filters?: FindProductsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ProductEntity>>>;

    register(product: ProductEntity): Promise<Result<ProductEntity>>;

    update(product: ProductEntity): Promise<Result<ProductEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
