import { BcryptHashProvider } from "@/modules/auth/providers/implementations/bcrypt-hash.provider";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { UserController } from "../controllers/user.controller";
import { UserEntity } from "../entities/user.entity";
import { TypeORMUserRepository } from "../repositories/implementations/type-orm-user.repository";
import { UserUseCase } from "../usecases/user.usecase";

export function makeUserController(context: RequestContext) {
    const repository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const hashProvider = new BcryptHashProvider();

    const usecase = new UserUseCase(context, repository, hashProvider);

    return new UserController(usecase);
}
