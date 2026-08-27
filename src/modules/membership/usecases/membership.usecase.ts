import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";

import { CreateMembershipDTO } from "../dto/create-membership.dto";
import { MembershipResponseDTO } from "../dto/membership-response.dto";
import { MembershipProps } from "../entities/membership.props";
import { MembershipRole } from "../enums/membership-role.enum";
import { MembershipAlreadyExistsError } from "../errors/membership-already-exists.error";
import { MembershipNotFoundError } from "../errors/membership-not-found.error";
import { IMembershipRepository } from "../repositories/membership-repository.interface";

export class MembershipUseCase {
    constructor(private readonly membershipRepository: IMembershipRepository) {}

    async create(data: CreateMembershipDTO): Promise<Result<MembershipProps>> {
        const existing = await this.membershipRepository.findByUserAndPlatform(
            data.userUID,
            data.platformUID
        );

        if (isFailure(existing)) {
            return ResultFactory.failure(new PersistenceError("Failed to find membership."));
        }

        if (existing.data) {
            return ResultFactory.failure(new MembershipAlreadyExistsError(existing.data.userUID));
        }

        const membership: MembershipProps = {
            uid: crypto.randomUUID(),
            userUID: data.userUID,
            platformUID: data.platformUID,
            role: data.role ?? MembershipRole.MEMBER,
            createdAt: new Date(),
        };

        const created = await this.membershipRepository.create(membership);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create membership."));
        }

        return ResultFactory.success(created.data);
    }

    async listByPlatform(platformUid: string): Promise<Result<MembershipResponseDTO[]>> {
        const memberships = await this.membershipRepository.listByPlatform(platformUid);

        if (isFailure(memberships)) {
            return memberships;
        }

        return ResultFactory.success(memberships.data);
    }

    async delete(uid: string): Promise<Result<void>> {
        const membership = await this.membershipRepository.findByUid(uid);

        if (isFailure(membership)) {
            return ResultFactory.failure(new PersistenceError("Failed to find membership."));
        }

        if (!membership.data) {
            return ResultFactory.failure(new MembershipNotFoundError({ uid }));
        }

        const deleted = await this.membershipRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete membership."));
        }

        return ResultFactory.ok();
    }
}
