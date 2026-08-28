import { DataSource } from "typeorm";

import { FeedEntity } from "@/modules/farmora/feed/entities/feed.entity";
import { FeedItemEntity } from "@/modules/farmora/feed/entities/feed-item.entity";
import { TypeORMFeedRepository } from "@/modules/farmora/feed/repositories/implementations/type-orm-feed.repository";
import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { TypeORMMembershipRepository } from "@/modules/membership/repositories/implementations/type-orm-membership.repository";
import { PlatformEntity } from "@/modules/platform/entities/platform.entity";
import { TypeORMPlatformRepository } from "@/modules/platform/repositories/implementations/type-orm-platform.repository";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { TypeORMUserRepository } from "@/modules/user/repositories/implementations/type-orm-user.repository";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";

import { ITransactionContext } from "../transaction-context.interface";
import { ITransactionManager } from "../transaction-manager.interface";

export class TypeORMTransactionManager implements ITransactionManager {
    constructor(private readonly dataSource: DataSource) {}

    async execute<T>(
        callback: (context: ITransactionContext) => Promise<Result<T>>
    ): Promise<Result<T>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const context: ITransactionContext = {
                platformRepository: new TypeORMPlatformRepository(
                    queryRunner.manager.getRepository(PlatformEntity)
                ),

                userRepository: new TypeORMUserRepository(
                    queryRunner.manager.getRepository(UserEntity)
                ),

                membershipRepository: new TypeORMMembershipRepository(
                    queryRunner.manager.getRepository(MembershipEntity)
                ),
                feedRepository: new TypeORMFeedRepository(
                    queryRunner.manager.getRepository(FeedEntity),
                    queryRunner.manager.getRepository(FeedItemEntity)
                ),
            };

            const result = await callback(context);

            if (isFailure(result)) {
                await queryRunner.rollbackTransaction();

                return result;
            }

            await queryRunner.commitTransaction();

            return result;
        } catch {
            await queryRunner.rollbackTransaction();

            return ResultFactory.failure(new PersistenceError("Transaction failed."));
        } finally {
            await queryRunner.release();
        }
    }
}
