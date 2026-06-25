import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateOrderItemDTO } from "../../dtos/create-order-item.dto";
import { OrderItemUsecase } from "../order-item.usecase";

export async function setupOrderItems(
    usecase: OrderItemUsecase,
    ...orderItems: CreateOrderItemDTO[]
) {
    return Promise.all(orderItems.map((order) => createOrderOrFail(usecase, order)));
}

export async function setupOrderItem(usecase: OrderItemUsecase, orderItem: CreateOrderItemDTO) {
    return createOrderOrFail(usecase, orderItem);
}

async function createOrderOrFail(usecase: OrderItemUsecase, dto: CreateOrderItemDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateOrderItemFailure<E extends AppError>(
    usecase: OrderItemUsecase,
    dto: CreateOrderItemDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
