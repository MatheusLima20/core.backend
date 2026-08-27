import { Result } from "@/shared/result";

import { MembershipEntity } from "../entities/membership.entity";

export interface IMembershipRepository {
    create(membership: MembershipEntity): Promise<Result<MembershipEntity>>;

    update(membership: MembershipEntity): Promise<Result<MembershipEntity>>;

    findByUid(uid: string): Promise<Result<MembershipEntity | null>>;

    findByUserAndPlatform(
        userUID: string,
        platformUID: string
    ): Promise<Result<MembershipEntity | null>>;

    listByUser(userUID: string): Promise<Result<MembershipEntity[]>>;

    listByPlatform(platformUID: string): Promise<Result<MembershipEntity[]>>;

    delete(uid: string): Promise<Result<void>>;
}
