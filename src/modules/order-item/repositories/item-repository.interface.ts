
import { CreateOrderItemResponseDTO } from "../dtos/create-order-item.dto";
import { OrderItemResponseDTO } from "../dtos/order-item-response.dto";
import { UpdateOrderItemResponseDTO } from "../dtos/update-order-item.dto";
import { OrderItemProps } from "../entities/order-item.props";

export interface IOrderItemRepository {
    findByOrderUID(orderUID: string): Promise<OrderItemResponseDTO[]>;
    findByProductAndOrderUID(productUID: string, orderUID: string): Promise<OrderItemResponseDTO | null>;
    findByUID(uid: string): Promise<OrderItemResponseDTO | null>;
    register(item: OrderItemProps): Promise<CreateOrderItemResponseDTO | null>;
    update(item: OrderItemProps): Promise<UpdateOrderItemResponseDTO | null>;
    delete(uid: string): Promise<boolean | null>;
}
