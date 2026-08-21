import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateUserDTO } from "../../../dtos/create-user.dto";
import { UserUseCase } from "../../user.usecase";

export async function setupUsers(usecase: UserUseCase, ...users: CreateUserDTO[]) {
    return Promise.all(users.map((user) => createUserOrFail(usecase, user)));
}

export async function setupUser(usecase: UserUseCase, user: CreateUserDTO) {
    return createUserOrFail(usecase, user);
}

async function createUserOrFail(usecase: UserUseCase, dto: CreateUserDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateUserFailure<E extends AppError>(
    usecase: UserUseCase,
    dto: CreateUserDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
