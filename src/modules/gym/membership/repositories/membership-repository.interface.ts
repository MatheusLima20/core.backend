import { MembershipProps } from "../entities/membership.props";

export interface IMembershipRepository {
    create(membership: MembershipProps): Promise<MembershipProps>;
    findByUid(uid: string): Promise<MembershipProps | null>;
    findByUserAndPlatform(
        userUID: string,
        platformUID: string,
    ): Promise<MembershipProps | null>;
    listByPlatform(platformUID: string): Promise<MembershipProps[]>;
    delete(uid: string): Promise<void>;
}