import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateOrderDTO } from "../../dtos/create-order.dto";
import { OrderUsecase } from "../order.usecase";

export async function setupOrders(
    usecase: OrderUsecase,
    ...orders: CreateOrderDTO[]
) {
    return Promise.all(
        orders.map((order) => createOrderOrFail(usecase, order)),
    );
}

export async function setupOrder(
    usecase: OrderUsecase,
    order: CreateOrderDTO,
) {
    return createOrderOrFail(usecase, order);
}

async function createOrderOrFail(
    usecase: OrderUsecase,
    dto: CreateOrderDTO,
) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateOrderFailure<E extends AppError>(
    usecase: OrderUsecase,
    dto: CreateOrderDTO,
    error: AppErrorClass<E>,
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
