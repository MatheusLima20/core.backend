import { OrderEntity } from "../entities/order.entity";

export type CreateOrderDTO = Pick<OrderEntity, "description" | "platformUID">;

export type CreateOrderResponseDTO = Pick<OrderEntity, "uid" | "description">;
