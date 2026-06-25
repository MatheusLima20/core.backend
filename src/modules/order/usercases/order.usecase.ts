import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateOrderDTO } from "../dtos/create-order.dto";
import { FindOrdersDTO } from "../dtos/find-order.dto";
import { UpdateOrderDTO, UpdateOrderResponseDTO } from "../dtos/update-order.dto";
import { OrderEntity } from "../entities/order.entity";
import { OrderProps } from "../entities/order.props";
import { OrderAlreadyExistsError } from "../errors/order-already-exists.error";
import { OrderNotFoundError } from "../errors/order-not-found.error";
import { OrderMapper } from "../mappers/order.mapper";
import { IOrderRepository } from "../repositories/order-repository.interface";

export class OrderUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly orderRepository: IOrderRepository
    ) {}

    async create(data: CreateOrderDTO): Promise<Result<OrderProps>> {
        const validation = await this.validateOrderAlreadyExists(data.description);

        if (!validation.success) {
            return validation;
        }

        const order = new OrderEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
            updatedBy: null,
            platformUID: this.context.user.platformUID,
            ...data,
        });

        const created = await this.orderRepository.register(order);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create order."));
        }

        return ResultFactory.success(created.data);
    }

    async findByUID(uid: string): Promise<Result<OrderProps>> {
        const result = await this.orderRepository.findByUID(uid, this.context.user.platformUID);

        if (!result.success || !result.data) {
            return ResultFactory.failure(new OrderNotFoundError({ uid }));
        }

        return ResultFactory.success(result.data);
    }

    async find(filters?: FindOrdersDTO): Promise<Result<OrderProps[]>> {
        const result = await this.orderRepository.find(this.context.user.platformUID, filters);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch orders."));
        }

        return ResultFactory.success(result.data);
    }

    async update(data: UpdateOrderDTO): Promise<Result<UpdateOrderResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const validation = await this.validateOrderAlreadyExists(data.description, data.uid);

        if (!validation.success) {
            return validation;
        }

        const mergedOrder = new OrderEntity({
            ...existing.data,
            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.orderRepository.update(mergedOrder);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update order."));
        }

        return ResultMapper.map(updated, OrderMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return ResultFactory.failure(new OrderNotFoundError({ uid }));
        }

        const deleted = await this.orderRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete order."));
        }

        return ResultFactory.ok();
    }

    private async validateOrderAlreadyExists(
        description: string,
        uid?: string
    ): Promise<Result<OrderProps | null>> {
        const result = await this.orderRepository.find(this.context.user.platformUID, {
            description,
        });

        if (isFailure(result)) {
            return result;
        }

        const [order] = result.data;

        if (order && order.uid !== uid) {
            return ResultFactory.failure(new OrderAlreadyExistsError(description));
        }

        return ResultFactory.success(order);
    }
}
