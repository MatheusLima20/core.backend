import { ProductEntity } from "../entities/product.entity";

export type ProductResponseDTO = Pick<
    ProductEntity,
    | "uid"
    | "platformUID"
    | "categoryUID"
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
