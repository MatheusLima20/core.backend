import { OrderProps } from "../entities/order.props";


export interface FindOrdersDTO {
    description?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        OrderProps,
        "description" | "createdBy" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}