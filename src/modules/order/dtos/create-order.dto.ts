import { OrderProps } from "../entities/order.props";

export type CreateOrderDTO = Pick<OrderProps, "description" | "platformUID">;

export type CreateOrderResponseDTO = Pick<OrderProps, "uid" | "description">;
