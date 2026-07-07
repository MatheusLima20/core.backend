import { randomUUID } from "crypto";

import { OrderNotFoundError } from "@/modules/gym/order/errors/order-not-found.error";
import { IOrderRepository } from "@/modules/gym/order/repositories/order-repository.interface";
import { ProductNotFoundError } from "@/modules/gym/product/errors/product-not-found.error";
import { RequestContext } from "@/shared/context/request-context";
import { AppError } from "@/shared/errors/app.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { FailureResult, Result, SuccessResult } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateOrderItemDTO } from "../dtos/create-order-item.dto";
import { OrderItemResponseDTO } from "../dtos/order-item-response.dto";
import { UpdateOrderItemDTO } from "../dtos/update-order-item.dto";
import { OrderItemEntity } from "../entities/order-item.entity";
import { OrderItemProps } from "../entities/order-item.props";
import { OrderItemAlreadyExistsError } from "../errors/order-item-already-exists.error";
import { OrderItemNotFoundError } from "../errors/order-item-not-found.error";
import { OrderItemMapper } from "../mappers/order-item.mapper";
import { IOrderItemRepository } from "../repositories/item-order-repository.interface";

export class OrderItemUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly itemRepository: IOrderItemRepository,
        private readonly orderRepository: IOrderRepository
    ) {}

    async create(data: CreateOrderItemDTO): Promise<Result<OrderItemEntity>> {
        const orderValidation = await this.validateOrderExists(data.orderUID);
        if (!orderValidation.success) {
            return ResultFactory.failure(new ProductNotFoundError({ uid: data.orderUID }));
        }

        const existsValidation = await this.validateItemAlreadyExistsInOrder(
            data.orderUID,
            data.productUID
        );

        if (!existsValidation.success)
            return ResultFactory.failure(new OrderItemAlreadyExistsError(data.productUID));

        const item = new OrderItemEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
            updatedBy: null,
            ...data,
        });

        const created = await this.itemRepository.register(item);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create order item."));
        }

        return ResultFactory.success(created.data);
    }

    async update(data: UpdateOrderItemDTO): Promise<Result<OrderItemEntity>> {
        const orderValidation = await this.validateOrderExists(data.orderUID);
        if (!orderValidation.success)
            return ResultFactory.failure(new OrderNotFoundError({ uid: data.orderUID }));

        const existsValidation = await this.validateItemAlreadyExistsInOrder(
            data.orderUID,
            data.productUID,
            data.uid
        );

        if (!existsValidation.success)
            return ResultFactory.failure(new OrderItemAlreadyExistsError(data.uid));

        const oldItem = await this.findByUID(data.uid);
        if (!oldItem.success) return oldItem;

        const mergedItem = new OrderItemEntity({
            ...oldItem.data,
            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.itemRepository.update(mergedItem);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update order item."));
        }

        return ResultFactory.success(updated.data);
    }

    async findByUID(uid: string): Promise<Result<OrderItemEntity>> {
        const result = await this.itemRepository.findByUID(this.context.user.platformUID, uid);

        const orderItem = ResultMapper.requireData(result, new OrderItemNotFoundError({ uid }));

        return ResultMapper.map(orderItem, OrderItemMapper.toResponseDTO);
    }

    async findByOrderUID(uid: string): Promise<Result<OrderItemResponseDTO[]>> {
        const orderItems = await this.itemRepository.findByOrderUID(
            this.context.user.platformUID,
            uid
        );
        return ResultMapper.map(orderItems, OrderItemMapper.toResponseDTOList);
    }

    async delete(uid: string): Promise<Result<void>> {
        const item = await this.findByUID(uid);
        if (!item.success) return ResultFactory.failure(new OrderItemNotFoundError({ uid }));

        const deleted = await this.itemRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete order item."));
        }

        return ResultFactory.ok();
    }

    private async validateOrderExists(uid: string): Promise<Result<void>> {
        const result = await this.orderRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) return result;

        if (!result.data) {
            return ResultFactory.failure(new ProductNotFoundError({ uid }));
        }

        return ResultFactory.ok();
    }

    private async validateItemAlreadyExistsInOrder(
        orderUID: string,
        productUID: string,
        currentUID?: string
    ): Promise<FailureResult<AppError> | SuccessResult<OrderItemProps | null>> {
        const result = await this.itemRepository.find(this.context.user.platformUID, {
            productUID,
            orderUID,
        });

        if (isFailure(result)) return result;

        const [item] = result.data;

        if (item && item.uid !== currentUID) {
            return ResultFactory.failure(new OrderItemAlreadyExistsError(item.uid));
        }

        return ResultFactory.success(item);
    }
}
