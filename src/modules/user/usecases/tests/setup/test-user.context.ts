import { FakeHashProvider } from "@/modules/auth/providers/implementations/fake-hash.provider";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryPlatformRepository } from "@/modules/platform/repositories/implementations/in-memory-platform.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { FakeTransactionManager } from "@/shared/database/transaction/implementations/fake-transaction-manager";
import { ITransactionContext } from "@/shared/database/transaction/transaction-context.interface";

import { InMemoryUserRepository } from "../../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../../user.usecase";

export class TestUserContext {
    userRepository = new InMemoryUserRepository();
    membershipRepository = new InMemoryMembershipRepository();
    platformRepository = new InMemoryPlatformRepository();

    transactionContext: ITransactionContext = {
        userRepository: this.userRepository,
        membershipRepository: this.membershipRepository,
        platformRepository: this.platformRepository,
    };

    transactionManager = new FakeTransactionManager(this.transactionContext);

    fakeHashProvider = new FakeHashProvider();

    users: AuthUser[] = [];

    userUsecases: UserUseCase[] = [];
}
