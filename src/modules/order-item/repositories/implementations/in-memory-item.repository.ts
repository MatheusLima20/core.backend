import { CreateOrderItemResponseDTO } from "../../dtos/create-order-item.dto";
import { OrderItemResponseDTO } from "../../dtos/order-item-response.dto";
import { UpdateOrderItemResponseDTO } from "../../dtos/update-order-item.dto";
import { OrderItemEntity } from "../../entities/order-item.entity";
import { OrderItemMapper } from "../../mappers/order-item.mapper";
import { IOrderItemRepository } from "../item-repository.interface";

export class InMemoryOrderItemRepository implements IOrderItemRepository {
    items: OrderItemEntity[] = [];

    async findByOrderUID(orderUID: string): Promise<OrderItemResponseDTO[]> {
        const item = this.items.filter((item) => item.orderUID === orderUID);

        return OrderItemMapper.toItemUIDResponseList(item);
    }

    async findByProductAndOrderUID(
        productUID: string,
        orderUID: string,
    ): Promise<OrderItemResponseDTO | null> {
        const items = this.items.filter((item) => item.orderUID === orderUID);

        return items.find((item) => item.productUID === productUID) || null;
    }

    async findByUID(uid: string): Promise<OrderItemResponseDTO | null> {
        return this.items.find((item) => item.uid === uid) || null;
    }

    async register(
        item: OrderItemEntity,
    ): Promise<CreateOrderItemResponseDTO | null> {
        this.items.push(item);

        return item;
    }

    async update(
        item: OrderItemEntity,
    ): Promise<UpdateOrderItemResponseDTO | null> {
        const index = this.items.findIndex(
            (oldItem) => oldItem.uid === item.uid,
        );

        const newItem = (this.items[index] = item);

        return newItem;
    }

    async delete(uid: string): Promise<boolean | null> {
        const index = this.items.findIndex((oldItem) => oldItem.uid === uid);

        const removedItem = this.items.splice(index, 1);

        return !!removedItem;
    }
}
