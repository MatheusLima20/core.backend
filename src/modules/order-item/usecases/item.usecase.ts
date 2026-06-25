import { randomUUID } from "crypto";

import { IOrderRepository } from "@/modules/order/repositories/order-repository.interface";
import { RequestContext } from "@/shared/context/request-context";

import { CreateOrderItemDTO } from "../dtos/create-order-item.dto";
import { UpdateOrderItemDTO } from "../dtos/update-order-item.dto";
import { OrderItemEntity } from "../entities/order-item.entity";
import { IOrderItemRepository } from "../repositories/item-repository.interface";

export class ItemUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly itemRepository: IOrderItemRepository,
        private readonly orderRepository: IOrderRepository
    ) {}

    async create(data: CreateOrderItemDTO) {
        await this.validateOrderExists(data.orderUID);

        await this.validateItemAlreadyExistsInOrder(data.orderUID, data.productUID);

        const item = new OrderItemEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const resultItem = await this.itemRepository.register(item);

        if (!resultItem) {
            throw new Error("Item not register!");
        }

        return resultItem;
    }

    async update(data: UpdateOrderItemDTO) {
        await this.validateOrderExists(data.orderUID);

        await this.validateItemAlreadyExistsInOrder(data.orderUID, data.productUID, data.uid);

        const oldItem = await this.findByUID(data.uid);

        const mergedItem = new OrderItemEntity({
            ...oldItem,
            ...data,
            updatedAt: new Date(),
        });

        const item = await this.itemRepository.update(mergedItem);

        if (!item) {
            throw new Error("Item not updated!");
        }

        return item;
    }

    async findByUID(uid: string) {
        const item = await this.itemRepository.findByUID(uid);

        if (!item) {
            throw new Error("Item not found!");
        }

        return item;
    }

    async findByOrderUID(uid: string) {
        return await this.itemRepository.findByOrderUID(uid);
    }

    async findByProductAndOrderUID(productUID: string, orderUID: string) {
        const item = await this.itemRepository.findByProductAndOrderUID(productUID, orderUID);

        if (!item) {
            throw new Error("Items not found!");
        }

        return item;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.itemRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Items not found!");
        }

        return isDeleted;
    }

    private async validateItemAlreadyExistsInOrder(
        orderUID: string,
        productUID: string,
        currentUID?: string
    ) {
        const item = await this.itemRepository.findByProductAndOrderUID(productUID, orderUID);

        if (item && item.uid !== currentUID) {
            throw new Error("Item already exists!");
        }
    }

    private async validateOrderExists(uid: string) {
        const item = await this.orderRepository.findByUID(this.context.user.platformUID, uid);

        if (!item) {
            throw new Error("Order not found!");
        }
    }
}
