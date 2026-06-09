import { ProductEntity } from "../entities/product.entity";

export type ProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "name"
    | "platformUID"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "price"
    | "amount"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
