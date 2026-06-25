import { Result } from "@/shared/result";

import { FindOrdersDTO } from "../dtos/find-order.dto";
import { OrderProps } from "../entities/order.props";

export interface IOrderRepository {
    findByUID(uid: string, platformUID: string): Promise<Result<OrderProps | null>>;
    find(
            platformUID: string,
            filters?: FindOrdersDTO,
        ): Promise<Result<OrderProps[]>>;
    register(order: OrderProps): Promise<Result<OrderProps>>;
    update(order: OrderProps): Promise<Result<OrderProps>>;
    delete(uid: string): Promise<Result<void>>;
}
