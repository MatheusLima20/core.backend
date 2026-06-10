import { OrderProps } from "../entities/order.props";


export type OrderResponseDTO = Pick<
    OrderProps,
    "uid" | "description" | "platformUID" | "createdBy" | "updatedBy" | "createdAt" | "updatedAt"
>;
