import { ResultFactory } from "@/shared/result/result.factory";
import { CreateMembershipDTO } from "../dto/create-membership.dto";
import { IMembershipRepository } from "../repositories/membership-repository.interface";
import { MembershipProps } from "../entities/membership.props";
import { MembershipRole } from "../enums/membership-role.enum";
import { MembershipAlreadyExistsError } from "../errors/membership-already-exists.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { MembershipNotFoundError } from "../errors/membership-not-found.error";

export class MembershipUseCase {
    constructor(private readonly membershipRepository: IMembershipRepository) {}

    async create(data: CreateMembershipDTO) {
        const existing = await this.membershipRepository.findByUserAndPlatform(
            data.userUID,
            data.platformUID,
        );

        if (existing) {
            return ResultFactory.failure(
                new MembershipAlreadyExistsError(existing.userUID),
            );
        }

        const membership: MembershipProps = {
            uid: crypto.randomUUID(),
            userUID: data.userUID,
            platformUID: data.platformUID,
            role: data.role ?? MembershipRole.MEMBER,
            createdAt: new Date(),
        };

        const created = await this.membershipRepository.create(membership);

        return ResultFactory.success(created);
    }

    async listByPlatform(platformUid: string) {
        const memberships =
            await this.membershipRepository.listByPlatform(platformUid);

        return ResultFactory.success(memberships);
    }

    async delete(uid: string) {
        const membership = await this.membershipRepository.findByUid(uid);
        
        if (!membership) {
            return ResultFactory.failure(new MembershipNotFoundError({ uid }));
        }

        await this.membershipRepository.delete(uid);

        return ResultFactory.ok();
    }
}
