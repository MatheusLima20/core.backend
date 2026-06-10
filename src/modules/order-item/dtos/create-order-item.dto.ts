import { OrderItemProps } from "../entities/order-item.props";

export type CreateOrderItemDTO = Pick<
    OrderItemProps,
    "orderUID" | "platformUID" | "unitPrice" | "amount" | "productUID"
>;

export type CreateOrderItemResponseDTO = Pick<OrderItemProps, "uid" | "orderUID" | "productUID" | "updatedAt">;