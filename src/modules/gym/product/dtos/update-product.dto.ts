import { ProductProps } from "../entities/product.props";

export type UpdateProductDTO = Pick<
    ProductProps,
    | "uid"
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "amount"
    | "currentPrice"
>;

export type UpdateProductResponseDTO = Pick<
    ProductProps,
    | "uid"
    | "name"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "currentPrice"
    | "amount"
    | "updatedBy"
    | "updatedAt"
>;
