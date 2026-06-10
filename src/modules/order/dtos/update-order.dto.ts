import { OrderProps } from "../entities/order.props";

export type UpdateOrderDTO = Pick<
    OrderProps,
    "uid" | "description" | "updatedBy"
>;

export type UpdateOrderResponseDTO = Pick<
    OrderProps,
    "uid" | "description" | "updatedBy" | "updatedAt"
>;
