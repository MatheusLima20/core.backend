import { CreateOrderResponseDTO } from "../dtos/create-order.dto";
import { OrderResponseDTO } from "../dtos/order-response.dto";
import { UpdateOrderResponseDTO } from "../dtos/update-order.dto";
import { OrderProps } from "../entities/order.props";

export interface IOrderRepository {
    find(platformUID: string): Promise<OrderResponseDTO[]>;
    findByUID(uid: string): Promise<OrderResponseDTO | null>;
    findByDescription(description: string): Promise<OrderResponseDTO | null>;
    register(order: OrderProps): Promise<CreateOrderResponseDTO | null>;
    update(order: OrderProps): Promise<UpdateOrderResponseDTO | null>;
    delete(uid: string): Promise<boolean>;
}
