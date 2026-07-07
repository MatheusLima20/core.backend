import { OrderProps } from "../entities/order.props";

export type CreateOrderDTO = Pick<OrderProps, "description">;

export type CreateOrderResponseDTO = Pick<OrderProps, "uid" | "description" | "createdBy">;
