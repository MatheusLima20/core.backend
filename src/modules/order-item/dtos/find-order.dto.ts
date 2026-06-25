import { OrderItemProps } from "../entities/order-item.props";

export interface FindOrdersItemsDTO {
    productUID?: string;
    orderUID?: string;
    unitPrice?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        OrderItemProps,
        "productUID" | "unitPrice" | "amount" | "orderUID" | "updatedAt" | "createdAt"
    >;

    order?: "asc" | "desc";
}
