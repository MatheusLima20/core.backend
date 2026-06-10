import { OrderItemProps } from "../entities/order-item.props";

export type UpdateOrderItemDTO = Pick<
    OrderItemProps,
    | "uid"
    | "orderUID"
    | "amount"
    | "productUID"
    | "unitPrice"

>;

export type UpdateOrderItemResponseDTO = Pick<
    OrderItemProps,
    "uid" | "orderUID" | "productUID" | "updatedAt"
>;
