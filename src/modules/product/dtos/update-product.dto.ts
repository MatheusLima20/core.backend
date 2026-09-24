import { ProductEntity } from "../entities/product.entity";

export type UpdateProductDTO = Partial<
    Pick<
        ProductEntity,
        | "categoryUID"
        | "contentUID"
        | "name"
        | "description"
        | "price"
        | "active"
        | "barcode"
        | "sku"
    >
> &
    Pick<ProductEntity, "uid">;

export type UpdateProductResponseDTO = Pick<
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
    | "updatedAt"
    | "updatedBy"
>;
