import { OrderProps } from "../entities/order.props";

export type UpdateOrderDTO = Pick<
    OrderProps,
    "uid" | "description"
>;

export type UpdateOrderResponseDTO = Pick<
    OrderProps,
    "uid" | "description" | "updatedBy" | "updatedAt"
>;
