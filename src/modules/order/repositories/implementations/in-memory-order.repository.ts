import { CreateOrderResponseDTO } from "../../dtos/create-order.dto";
import { OrderResponseDTO } from "../../dtos/order-response.dto";
import { UpdateOrderResponseDTO } from "../../dtos/update-order.dto";
import { OrderEntity } from "../../entities/order.entity";
import { OrderMapper } from "../../mappers/order.mapper";
import { IOrderRepository } from "../order-repository.interface";

export class InMemoryOrderRepository implements IOrderRepository {
    private orders: OrderEntity[] = [
        {
            uid: "1",
            description: "buy to main room.",
            platformUID: "1",
            createdAt: new Date("2026-05-07"),
            updatedAt: new Date("2026-05-07"),
        },
        {
            uid: "2",
            description: "buy to meeting room.",
            platformUID: "1",
            createdAt: new Date("2026-05-07"),
            updatedAt: new Date("2026-05-07"),
        },
    ];

    async find(platformUID: string): Promise<OrderResponseDTO[]> {

        const orders = this.orders.filter(order => order.platformUID === platformUID);

        return OrderMapper.toOrderUIDResponseList(orders);
    }

    async findByUID(uid: string): Promise<OrderResponseDTO | null> {
        return this.orders.find((item) => item.uid === uid) || null;
    }

    async findByDescription(
        description: string,
    ): Promise<OrderResponseDTO | null> {
        return (
            this.orders.find((order) => order.description === description) ||
            null
        );
    }

    async register(order: OrderEntity): Promise<CreateOrderResponseDTO | null> {
        this.orders.push(order);

        return order;
    }

    async update(order: OrderEntity): Promise<UpdateOrderResponseDTO | null> {
        const index = this.orders.findIndex(
            (oldOrder) => oldOrder.uid === order.uid,
        );

        const newOrder = (this.orders[index] = order);

        return newOrder;
    }

    async delete(uid: string): Promise<boolean> {
        const index = this.orders.findIndex((oldOrder) => oldOrder.uid === uid);

        const removedOrder = this.orders.splice(index, 1);

        return !!removedOrder;
    }
}
