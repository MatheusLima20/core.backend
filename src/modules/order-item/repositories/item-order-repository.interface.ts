import { Result } from "@/shared/result";

import { FindOrdersItemsDTO } from "../dtos/find-order.dto";
import { OrderItemProps } from "../entities/order-item.props";

export interface IOrderItemRepository {
    findByOrderUID(platformUID: string, orderUID: string): Promise<Result<OrderItemProps[]>>;
    find(platformUID: string, filters: FindOrdersItemsDTO): Promise<Result<OrderItemProps[]>>;
    findByUID(platformUID: string, uid: string): Promise<Result<OrderItemProps | null>>;
    register(item: OrderItemProps): Promise<Result<OrderItemProps>>;
    update(item: OrderItemProps): Promise<Result<OrderItemProps>>;
    delete(uid: string): Promise<Result<void>>;
}
