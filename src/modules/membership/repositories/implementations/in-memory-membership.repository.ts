import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { MembershipProps } from "../../entities/membership.props";
import { MembershipRole } from "../../enums/membership-role.enum";
import { IMembershipRepository } from "../membership-repository.interface";

export class InMemoryMembershipRepository implements IMembershipRepository {
    memberships: MembershipProps[] = [
        {
            uid: "membership-1",
            userUID: "1",
            platformUID: "1",
            role: MembershipRole.ADMIN,
            createdAt: new Date(),
        },
        {
            uid: "membership-2",
            userUID: "2",
            platformUID: "2",
            role: MembershipRole.ADMIN,
            createdAt: new Date(),
        },
        {
            uid: "membership-3",
            userUID: "3",
            platformUID: "1",
            role: MembershipRole.ADMIN,
            createdAt: new Date(),
        },
    ];

    async create(membership: MembershipProps): Promise<Result<MembershipProps>> {
        this.memberships.push(membership);

        return ResultFactory.success(membership);
    }

    async update(membership: MembershipProps): Promise<Result<MembershipProps>> {
        const index = this.memberships.findIndex(
            (oldMembership) => oldMembership.uid === membership.uid
        );

        if (index === -1) {
            return ResultFactory.success(membership);
        }

        this.memberships[index] = membership;

        return ResultFactory.success(membership);
    }

    async findByUid(uid: string): Promise<Result<MembershipProps | null>> {
        const membership = this.memberships.find((membership) => membership.uid === uid);

        return ResultFactory.success(membership ?? null);
    }

    async findByUserAndPlatform(
        userUID: string,
        platformUID: string
    ): Promise<Result<MembershipProps | null>> {
        const membership = this.memberships.find(
            (membership) => membership.userUID === userUID && membership.platformUID === platformUID
        );

        return ResultFactory.success(membership ?? null);
    }

    async listByUser(userUID: string): Promise<Result<MembershipProps[]>> {
        const memberships = this.memberships.filter((membership) => membership.userUID === userUID);

        return ResultFactory.success(memberships);
    }

    async listByPlatform(platformUID: string): Promise<Result<MembershipProps[]>> {
        const memberships = this.memberships.filter(
            (membership) => membership.platformUID === platformUID
        );

        return ResultFactory.success(memberships);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.memberships.findIndex((membership) => membership.uid === uid);

        if (index !== -1) {
            this.memberships.splice(index, 1);
        }

        return ResultFactory.ok();
    }
}
