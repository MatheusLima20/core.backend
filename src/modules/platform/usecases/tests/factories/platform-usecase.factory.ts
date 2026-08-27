import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { FakeTransactionManager } from "@/shared/database/transaction/implementations/fake-transaction-manager";

import { InMemoryPlatformRepository } from "../../../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../../platform.usecase";

export function makePlatformUsecase(
    user: AuthUser,
    transactionManager: FakeTransactionManager,
    platformRepository: InMemoryPlatformRepository,
    membershipRepository: InMemoryMembershipRepository
) {
    const context = { user };

    return {
        usecase: new PlatformUsecase(
            context,
            transactionManager,
            platformRepository,
            membershipRepository
        ),
    };
}
