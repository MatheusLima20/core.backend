import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateTransactionCategoryDTO } from "../../../dtos/create-transaction-category.dto";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";

export async function setupTransactionCategories(
    usecase: TransactionCategoryUsecase,
    ...categories: CreateTransactionCategoryDTO[]
) {
    return Promise.all(
        categories.map((category) => createTransactionCategoryOrFail(usecase, category))
    );
}

export async function setupTransactionCategory(
    usecase: TransactionCategoryUsecase,
    category: CreateTransactionCategoryDTO
) {
    return createTransactionCategoryOrFail(usecase, category);
}

async function createTransactionCategoryOrFail(
    usecase: TransactionCategoryUsecase,
    dto: CreateTransactionCategoryDTO
) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateTransactionCategoryFailure<E extends AppError>(
    usecase: TransactionCategoryUsecase,
    dto: CreateTransactionCategoryDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
