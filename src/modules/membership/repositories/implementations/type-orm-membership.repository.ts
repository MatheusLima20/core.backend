import { Repository } from "typeorm";

import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { MembershipEntity } from "../../entities/membership.entity";
import { MembershipProps } from "../../entities/membership.props";
import { IMembershipRepository } from "../membership-repository.interface";

export class TypeORMMembershipRepository implements IMembershipRepository {
    constructor(private readonly repository: Repository<MembershipEntity>) {}

    async create(membership: MembershipProps): Promise<Result<MembershipProps>> {
        const savedMembership = await this.repository.save(membership);

        return ResultFactory.success(savedMembership);
    }

    async update(membership: MembershipProps): Promise<Result<MembershipProps>> {
        const updatedMembership = await this.repository.save(membership);

        return ResultFactory.success(updatedMembership);
    }

    async findByUid(uid: string): Promise<Result<MembershipProps | null>> {
        const membership = await this.repository.findOne({
            where: {
                uid,
            },
        });

        return ResultFactory.success(membership ? membership : null);
    }

    async findByUserAndPlatform(
        userUID: string,
        platformUID: string
    ): Promise<Result<MembershipProps | null>> {
        const membership = await this.repository.findOne({
            where: {
                userUID,
                platformUID,
            },
        });

        return ResultFactory.success(membership ? membership : null);
    }

    async listByUser(userUID: string): Promise<Result<MembershipProps[]>> {
        const memberships = await this.repository.find({
            where: {
                userUID,
            },
        });

        return ResultFactory.success(memberships);
    }

    async listByPlatform(platformUID: string): Promise<Result<MembershipProps[]>> {
        const memberships = await this.repository.find({
            where: {
                platformUID,
            },
        });

        return ResultFactory.success(memberships);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.repository.delete({
            uid,
        });

        return ResultFactory.ok();
    }
}
