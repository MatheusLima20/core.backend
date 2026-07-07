import { ProductProps } from "../entities/product.props";

export type CreateProductDTO = Pick<
    ProductProps,
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "amount"
    | "currentPrice"
>;

export type CreateProductResponseDTO = Pick<
    ProductProps,
    | "uid"
    | "name"
    | "isForSale"
    | "isOnSale"
    | "currentPrice"
    | "amount"
    | "description"
    | "platformUID"
    | "createdBy"
    | "createdAt"
>;
