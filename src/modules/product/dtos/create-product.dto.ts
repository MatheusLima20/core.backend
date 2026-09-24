import { ProductEntity } from "../entities/product.entity";

export type CreateProductDTO = Pick<
    ProductEntity,
    "categoryUID" | "contentUID" | "name" | "description" | "price" | "active" | "barcode" | "sku"
>;

export type CreateProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "categoryUID"
    | "contentUID"
    | "name"
    | "description"
    | "price"
    | "active"
    | "barcode"
    | "sku"
    | "createdAt"
    | "createdBy"
>;
