import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateMembershipDTO } from "../../dto/create-membership.dto";
import { MembershipRole } from "../../enums/membership-role.enum";
import { MembershipAlreadyExistsError } from "../../errors/membership-already-exists.error";
import { MembershipNotFoundError } from "../../errors/membership-not-found.error";
import { InMemoryMembershipRepository } from "../../repositories/implementations/in-memory-membership.repository";
import { MembershipUseCase } from "../membership.usecase";

describe("MembershipUseCase", () => {
    const membership1: CreateMembershipDTO = {
        userUID: "4",
        platformUID: "1",
        role: MembershipRole.OWNER,
    };

    const membership2: CreateMembershipDTO = {
        userUID: "5",
        platformUID: "1",
        role: MembershipRole.ADMIN,
    };

    let repository: InMemoryMembershipRepository;
    let useCase: MembershipUseCase;

    beforeEach(() => {
        repository = new InMemoryMembershipRepository();
        useCase = new MembershipUseCase(repository);
    });

    test("should create a membership", async () => {
        const membership = expectSuccess(await useCase.create(membership1));

        expect(membership).toHaveProperty("uid");
        expect(membership.userUID).toBe("4");
        expect(membership.platformUID).toBe("1");
        expect(membership.role).toBe(MembershipRole.OWNER);
    });

    test("should not allow duplicate membership", async () => {
        await useCase.create(membership1);

        expectFailure(await useCase.create(membership1), MembershipAlreadyExistsError);
    });

    test("should list memberships by platform", async () => {
        await useCase.create(membership1);
        await useCase.create(membership2);

        const memberships = expectSuccess(await useCase.listByPlatform(membership1.platformUID));

        expect(memberships.length).toBe(4);
    });

    test("should remove a membership", async () => {
        const created = expectSuccess(await useCase.create(membership1));

        expectSuccess(await useCase.delete(created.uid));

        const deleted = expectSuccess(await repository.findByUid(created.uid));

        expect(deleted).toBeNull();
    });

    test("should return not found when removing missing membership", async () => {
        expectFailure(await useCase.delete("invalid-id"), MembershipNotFoundError);
    });
});
