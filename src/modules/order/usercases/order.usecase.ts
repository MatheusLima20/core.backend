import { randomUUID } from "crypto";
import { IOrderRepository } from "../repositories/order-repository.interface";
import { CreateOrderDTO } from "../dtos/create-order.dto";
import { OrderEntity } from "../entities/order.entity";
import { UpdateOrderDTO } from "../dtos/update-order.dto";

export class OrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async create(data: CreateOrderDTO) {
        await this.validateOrderAlreadyExists(data.description);

        const order = new OrderEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const resultOrder = await this.orderRepository.register(order);

        if (!resultOrder) {
            throw new Error("Order not register!");
        }

        return resultOrder;
    }

    async findByUID(uid: string) {
        const order = await this.orderRepository.findByUID(uid);

        if (!order) {
            throw new Error("Order not found!");
        }

        return order;
    }

    async findByDescription(description: string) {
        const order = await this.orderRepository.findByDescription(description);

        if (!order) {
            throw new Error("Order not found!");
        }

        return order;
    }

    async find(platformUID: string) {
        const order = await this.orderRepository.find(platformUID);

        if (!order) {
            throw new Error("Orders not found!");
        }

        return order;
    }

    async update(data: UpdateOrderDTO) {
        await this.validateOrderAlreadyExists(data.description, data.uid);

        const oldOrder = await this.findByUID(data.uid);

        const mergedOrder = new OrderEntity({
            ...oldOrder,
            ...data,
            updatedAt: new Date(),
        });

        const order = await this.orderRepository.update(mergedOrder);

        if (!order) {
            throw new Error("Order not updated!");
        }

        return order;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.orderRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Order not deleted!");
        }

        return isDeleted;
    }

    private async validateOrderAlreadyExists(
        description: string,
        uid?: string,
    ) {
        const order = await this.orderRepository.findByDescription(description);

        if (order && order.uid !== uid) {
            throw new Error("Order already exists!");
        }
    }
}
