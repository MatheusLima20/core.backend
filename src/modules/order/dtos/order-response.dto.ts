import { OrderEntity } from "../entities/order.entity";

export type OrderResponseDTO = Pick<
    OrderEntity,
    "uid" | "description" | "platformUID" | "createdAt" | "updatedAt"
>;
