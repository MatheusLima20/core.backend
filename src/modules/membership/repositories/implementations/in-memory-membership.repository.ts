import { IMembershipRepository } from "../membership-repository.interface";
import { MembershipProps } from "../../entities/membership.props";

export class InMemoryMembershipRepository implements IMembershipRepository {
    private memberships: MembershipProps[] = [];

    async create(membership: MembershipProps): Promise<MembershipProps> {
        this.memberships.push(membership);
        return membership;
    }

    async findByUid(uid: string): Promise<MembershipProps | null> {
        const membership = this.memberships.find(
            (membership) => membership.uid === uid,
        );

        return membership ?? null;
    }

    async findByUserAndPlatform(
        userUid: string,
        platformUid: string,
    ): Promise<MembershipProps | null> {
        const membership = this.memberships.find(
            (m) =>
                m.userUID === userUid &&
                m.platformUID === platformUid,
        );

        return membership ?? null;
    }

    async listByPlatform(platformUid: string): Promise<MembershipProps[]> {
        return this.memberships.filter(
            (membership) => membership.platformUID === platformUid,
        );
    }

    async delete(uid: string): Promise<void> {
        const index = this.memberships.findIndex(
            (membership) => membership.uid === uid,
        );

        if (index !== -1) {
            this.memberships.splice(index, 1);
        }
    }
}