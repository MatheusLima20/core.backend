import { Result } from "@/shared/result";

import { FindProductsDTO } from "../dtos/find-products.dto";
import { ProductProps } from "../entities/product.props";

export interface IProductRepository {
    findByUID(
        uid: string,
        platformUID: string,
    ): Promise<Result<ProductProps | null>>;
    find(
        platformUID: string,
        filters?: FindProductsDTO,
    ): Promise<Result<ProductProps[]>>;
    register(user: ProductProps): Promise<Result<ProductProps>>;
    update(user: ProductProps): Promise<Result<ProductProps>>;
    delete(uid: string): Promise<Result<void>>;
}
