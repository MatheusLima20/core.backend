import { ProductEntity } from "../entities/product.entity";

export interface ProductWithContent {
    product: ProductEntity;
    content: {
        url: string;
    } | null;
}
