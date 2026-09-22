import { ProductEntity } from "../entities/product.entity";

export interface FindProductsDTO {
    categoryUID?: string;

    name?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<ProductEntity, "name" | "price" | "createdAt">;

    order?: "asc" | "desc";
}
