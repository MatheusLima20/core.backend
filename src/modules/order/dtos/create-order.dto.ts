import { OrderProps } from "../entities/order.props";

export type CreateOrderDTO = Pick<OrderProps, "description" | "platformUID" | "createdBy">;

export type CreateOrderResponseDTO = Pick<OrderProps, "uid" | "description" | "createdBy">;
