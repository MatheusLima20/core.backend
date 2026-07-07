import { ProductProps } from "../entities/product.props";

export interface FindProductsDTO {
    name?: string;
    description?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        ProductProps,
        "name" | "description" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}