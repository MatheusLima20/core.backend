import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindOrdersItemsDTO } from "../../dtos/find-order.dto";
import { OrderItemProps } from "../../entities/order-item.props";
import { IOrderItemRepository } from "../item-order-repository.interface";

export class InMemoryOrderItemRepository implements IOrderItemRepository {
    items: OrderItemProps[] = [];

    async findByOrderUID(platformUID: string, orderUID: string): Promise<Result<OrderItemProps[]>> {
        const items = this.items.filter((item) => item.platformUID === platformUID);
        const orderItems = items.filter((item) => item.orderUID === orderUID);

        return ResultFactory.success(orderItems);
    }

    async find(
        platformUID: string,
        filters?: FindOrdersItemsDTO
    ): Promise<Result<OrderItemProps[], PersistenceError>> {
        let orderItems = this.items.filter((product) => product.platformUID === platformUID);

        if (filters?.orderUID) {
            const orderUID = filters.orderUID.toLowerCase();

            orderItems = orderItems.filter((product) =>
                product.orderUID.toLowerCase().includes(orderUID)
            );
        }

        if (filters?.productUID) {
            const description = filters.productUID.toLowerCase();

            orderItems = orderItems.filter((product) =>
                product.productUID.toLowerCase().includes(description)
            );
        }

        if (filters?.orderBy) {
            const orderBy = filters.orderBy;
            const order = filters.order ?? "asc";

            orderItems.sort((a, b) => {
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

            orderItems = orderItems.slice(start, end);
        }

        return ResultFactory.success(orderItems);
    }

    async findByUID(platformUID: string, uid: string): Promise<Result<OrderItemProps | null>> {
        const items = this.items.filter((item) => item.platformUID === platformUID);

        const item = items.find((item) => item.uid === uid) || null;

        return ResultFactory.success(item);
    }

    async register(item: OrderItemProps): Promise<Result<OrderItemProps>> {
        this.items.push(item);

        return ResultFactory.success(item);
    }

    async update(item: OrderItemProps): Promise<Result<OrderItemProps>> {
        const index = this.items.findIndex((oldItem) => oldItem.uid === item.uid);

        this.items[index] = item;

        return ResultFactory.success(item);
    }

    async delete(uid: string): Promise<Result<void>> {
        const items = this.items.filter((oldItem) => oldItem.uid !== uid);

        this.items = items;

        return ResultFactory.ok();
    }
}
