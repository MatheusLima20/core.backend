import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { FakeTransactionManager } from "@/shared/database/transaction/implementations/fake-transaction-manager";
import { ITransactionContext } from "@/shared/database/transaction/transaction-context.interface";

import { InMemoryPlatformRepository } from "../../../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../../platform.usecase";

export class TestPlatformContext {
    platformRepository = new InMemoryPlatformRepository();

    userRepository = new InMemoryUserRepository();

    membershipRepository = new InMemoryMembershipRepository();

    transactionContext: ITransactionContext = {
        userRepository: this.userRepository,
        membershipRepository: this.membershipRepository,
        platformRepository: this.platformRepository,
    };

    transactionManager = new FakeTransactionManager(this.transactionContext);

    platformUsecases: PlatformUsecase[] = [];

    users: AuthUser[] = [];
}
