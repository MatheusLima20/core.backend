import { Result } from "@/shared/result";

import { MembershipProps } from "../entities/membership.props";

export interface IMembershipRepository {
    create(membership: MembershipProps): Promise<Result<MembershipProps>>;

    update(membership: MembershipProps): Promise<Result<MembershipProps>>;

    findByUid(uid: string): Promise<Result<MembershipProps | null>>;

    findByUserAndPlatform(
        userUID: string,
        platformUID: string
    ): Promise<Result<MembershipProps | null>>;

    listByUser(userUID: string): Promise<Result<MembershipProps[]>>;

    listByPlatform(platformUID: string): Promise<Result<MembershipProps[]>>;

    delete(uid: string): Promise<Result<void>>;
}
