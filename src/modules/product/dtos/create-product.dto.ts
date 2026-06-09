import { ProductEntity } from "../entities/product.entity";

export type CreateProductDTO = Pick<
    ProductEntity,
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "platformUID"
    | "amount"
    | "price"
    | "createdBy"
>;

export type CreateProductResponseDTO = Pick<
    ProductEntity,
    "uid" | "name" | "description" | "platformUID" | "createdBy" | "createdAt"
>;
