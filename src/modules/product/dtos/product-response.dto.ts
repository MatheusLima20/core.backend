import { ProductEntity } from "../entities/product.entity";

export type ProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "platformUID"
    | "categoryUID"
    | "contentUID"
    | "name"
    | "description"
    | "price"
    | "active"
    | "barcode"
    | "sku"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
