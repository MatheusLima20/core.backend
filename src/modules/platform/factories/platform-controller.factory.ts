import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { TypeORMMembershipRepository } from "@/modules/membership/repositories/implementations/type-orm-membership.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";
import { TypeORMTransactionManager } from "@/shared/database/transaction/implementations/typeorm-transaction-manager";

import { PlatformController } from "../controllers/platform.controller";
import { PlatformEntity } from "../entities/platform.entities";
import { TypeORMPlatformRepository } from "../repositories/implementations/type-orm-platform.repository";
import { PlatformUsecase } from "../usecases/platform.usecase";

export function makePlatformController(context: RequestContext) {
    const platformRepository = new TypeORMPlatformRepository(
        dataSource.getRepository(PlatformEntity)
    );

    const membershipRepository = new TypeORMMembershipRepository(
        dataSource.getRepository(MembershipEntity)
    );

    const transactionManager = new TypeORMTransactionManager(dataSource);

    const usecase = new PlatformUsecase(
        context,
        transactionManager,
        platformRepository,
        membershipRepository
    );

    return new PlatformController(usecase);
}
