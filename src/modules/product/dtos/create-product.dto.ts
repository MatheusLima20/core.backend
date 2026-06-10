import { ProductProps } from "../entities/product.props";


export type CreateProductDTO = Pick<
    ProductProps,
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "platformUID"
    | "amount"
    | "currentPrice"
    | "createdBy"
>;

export type CreateProductResponseDTO = Pick<
    ProductProps,
    "uid" | "name" | "description" | "platformUID" | "createdBy" | "createdAt"
>;
