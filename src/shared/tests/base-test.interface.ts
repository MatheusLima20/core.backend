import { InMemoryFeedRepository } from "@/modules/farmora/feed/repositories/implementations/in-memory-feed.repository";
import { InMemoryInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/in-memory-inventory-item.repository";
import { IInventoryItemRepository } from "@/modules/farmora/inventory/repositories/inventory-item-repository.interface";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryPlatformRepository } from "@/modules/platform/repositories/implementations/in-memory-platform.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { ITransactionContext } from "@/shared/database/transaction/transaction-context.interface";

import { AuthUser } from "../context/auth.user";
import { FakeTransactionManager } from "../database/transaction/implementations/fake-transaction-manager";

export class BaseTestTransactionContext {
    userRepository = new InMemoryUserRepository();

    platformRepository = new InMemoryPlatformRepository();

    membershipRepository = new InMemoryMembershipRepository();

    feedRepository = new InMemoryFeedRepository();

    inventoryItemRepository: IInventoryItemRepository = new InMemoryInventoryItemRepository();

    transactionContext: ITransactionContext = {
        userRepository: this.userRepository,
        membershipRepository: this.membershipRepository,
        platformRepository: this.platformRepository,
        inventoryItemRepository: this.inventoryItemRepository,
        feedRepository: this.feedRepository,
    };

    transactionManager = new FakeTransactionManager(this.transactionContext);

    users: AuthUser[] = [];
}
