import { IHashProvider } from "@/modules/auth/providers/hash-provider.interface";
import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
import { AuthUser } from "@/shared/context/auth.user";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export function makeUserUsecase(
    user: AuthUser,
    userRepository: InMemoryUserRepository,
    transactionManager: ITransactionManager,
    membershipRepository: IMembershipRepository,
    hashProvider: IHashProvider
) {
    const context = { user };

    return {
        usecase: new UserUseCase(
            context,
            transactionManager,
            userRepository,
            membershipRepository,
            hashProvider
        ),
    };
}
