import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateStockDTO } from "../../../dtos/create-stock.dto";
import { StockUsecase } from "../../stock.usecase";

export async function setupStocks(usecase: StockUsecase, ...stocks: CreateStockDTO[]) {
    return Promise.all(stocks.map((stock) => createStockOrFail(usecase, stock)));
}

export async function setupStock(usecase: StockUsecase, stock: CreateStockDTO) {
    return createStockOrFail(usecase, stock);
}

async function createStockOrFail(usecase: StockUsecase, dto: CreateStockDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateStockFailure<E extends AppError>(
    usecase: StockUsecase,
    dto: CreateStockDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
