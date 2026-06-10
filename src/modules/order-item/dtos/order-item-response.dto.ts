import { OrderItemProps } from "../entities/order-item.props";

export type OrderItemResponseDTO = Pick<
    OrderItemProps,
    | "uid"
    | "platformUID"
    | "productUID"
    | "unitPrice"
    | "amount"
    | "orderUID"
    | "createdAt"
    | "updatedAt"
>;
