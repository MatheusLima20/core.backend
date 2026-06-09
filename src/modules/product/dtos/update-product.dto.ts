import { ProductEntity } from "../entities/product.entity";

export type UpdateProductDTO = Pick<
    ProductEntity,
    | "uid"
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "amount"
    | "price"
    | "updatedBy"
>;

export type UpdateProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "price"
    | "amount"
    | "updatedAt"
>;
