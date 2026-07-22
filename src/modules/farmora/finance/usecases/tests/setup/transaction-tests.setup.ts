import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateTransactionDTO } from "../../../dtos/create-transaction.dto";
import { TransactionUsecase } from "../../transaction.usecase";

export async function setupTransactions(
    usecase: TransactionUsecase,
    ...transactions: CreateTransactionDTO[]
) {
    return Promise.all(
        transactions.map((transaction) => createTransactionOrFail(usecase, transaction))
    );
}

export async function setupTransaction(
    usecase: TransactionUsecase,
    transaction: CreateTransactionDTO
) {
    return createTransactionOrFail(usecase, transaction);
}

async function createTransactionOrFail(usecase: TransactionUsecase, dto: CreateTransactionDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateTransactionFailure<E extends AppError>(
    usecase: TransactionUsecase,
    dto: CreateTransactionDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
