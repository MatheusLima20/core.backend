import { ProductEntity } from "../entities/product.entity";

export type CreateProductDTO = Pick<
    ProductEntity,
    "categoryUID" | "name" | "description" | "price" | "active" | "barcode" | "sku"
>;

export type CreateProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "categoryUID"
    | "name"
    | "description"
    | "price"
    | "active"
    | "barcode"
    | "sku"
    | "createdAt"
    | "createdBy"
>;
