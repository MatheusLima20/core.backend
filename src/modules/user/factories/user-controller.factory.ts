import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { UserController } from "../controllers/user.controller";
import { UserEntity } from "../entities/user.entity";
import { TypeORMUserRepository } from "../repositories/implementations/type-orm-user.repository";
import { UserUseCase } from "../usecases/user.usecase";

export function makeUserController(context: RequestContext): UserController {
    const repository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const usecase = new UserUseCase(context, repository);

    return new UserController(usecase);
}
