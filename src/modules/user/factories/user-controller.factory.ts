import { BcryptHashProvider } from "@/modules/auth/providers/implementations/bcrypt-hash.provider";
import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { TypeORMMembershipRepository } from "@/modules/membership/repositories/implementations/type-orm-membership.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";
import { TypeORMTransactionManager } from "@/shared/database/transaction/implementations/typeorm-transaction-manager";

import { UserController } from "../controllers/user.controller";
import { UserEntity } from "../entities/user.entity";
import { TypeORMUserRepository } from "../repositories/implementations/type-orm-user.repository";
import { UserUseCase } from "../usecases/user.usecase";

export function makeUserController(context: RequestContext) {
    const userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const transactionManager = new TypeORMTransactionManager(dataSource);

    const membershipRepository = new TypeORMMembershipRepository(
        dataSource.getRepository(MembershipEntity)
    );

    const hashProvider = new BcryptHashProvider();

    const usecase = new UserUseCase(
        context,
        transactionManager,
        userRepository,
        membershipRepository,
        hashProvider
    );

    return new UserController(usecase);
}
