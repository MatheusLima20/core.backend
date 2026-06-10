import { ProductProps } from "../entities/product.props";


export type ProductResponseDTO = Pick<
    ProductProps,
    | "uid"
    | "name"
    | "platformUID"
    | "description"
    | "isForSale"
    | "isOnSale"
    | "currentPrice"
    | "amount"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
