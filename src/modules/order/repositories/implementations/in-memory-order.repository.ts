import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindOrdersDTO } from "../../dtos/find-order.dto";
import { OrderEntity } from "../../entities/order.entity";
import { OrderProps } from "../../entities/order.props";
import { IOrderRepository } from "../order-repository.interface";

export class InMemoryOrderRepository implements IOrderRepository {
    private orders: OrderProps[] = [
        {
            uid: "1",
            description: "buy to main room.",
            platformUID: "1",
            createdBy: "2",
            updatedBy: null,
            createdAt: new Date("2026-05-07"),
            updatedAt: new Date("2026-05-07"),
        },
        {
            uid: "2",
            description: "buy to meeting room.",
            platformUID: "1",
            createdBy: "2",
            updatedBy: null,
            createdAt: new Date("2026-05-07"),
            updatedAt: new Date("2026-05-07"),
        },
    ];

    async find(
        platformUID: string,
        filters?: FindOrdersDTO
    ): Promise<Result<OrderProps[], PersistenceError>> {
        let orders = this.orders.filter((order) => order.platformUID === platformUID);

        if (filters?.description) {
            const description = filters.description.toLowerCase();

            orders = orders.filter((order) =>
                order.description.toLowerCase().includes(description)
            );
        }

        if (filters?.description) {
            const description = filters.description.toLowerCase();

            orders = orders.filter((order) =>
                order.description.toLowerCase().includes(description)
            );
        }

        if (filters?.orderBy) {
            const orderBy = filters.orderBy;
            const order = filters.order ?? "asc";

            orders.sort((a, b) => {
                const left = a[orderBy];
                const right = b[orderBy];

                if (left < right) return order === "asc" ? -1 : 1;
                if (left > right) return order === "asc" ? 1 : -1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            orders = orders.slice(start, end);
        }

        return ResultFactory.success(orders);
    }

    async findByUID(uid: string, platformUID: string): Promise<Result<OrderProps | null>> {
        const orders = this.orders.filter((order) => order.platformUID === platformUID);
        const order = orders.find((order) => order.uid === uid);

        return ResultFactory.success(order ?? null);
    }

    async findByDescription(description: string): Promise<OrderProps | null> {
        return this.orders.find((order) => order.description === description) || null;
    }

    async register(order: OrderEntity): Promise<Result<OrderProps>> {
        this.orders.push(order);

        return ResultFactory.success(order);
    }

    async update(order: OrderEntity): Promise<Result<OrderProps>> {
        const index = this.orders.findIndex((oldOrder) => oldOrder.uid === order.uid);

        const newOrder = (this.orders[index] = order);

        return ResultFactory.success(newOrder);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.orders.findIndex((oldOrder) => oldOrder.uid === uid);

        this.orders.splice(index, 1);

        return ResultFactory.ok();
    }
}
