import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";
import { MembershipRole } from "../../enums/membership-role.enum";
import { InMemoryMembershipRepository } from "../../repositories/implementations/in-memory-membership.repository";
import { MembershipUseCase } from "../membership.usecase";
import { CreateMembershipDTO } from "../../dto/create-membership.dto";
import { MembershipAlreadyExistsError } from "../../errors/membership-already-exists.error";
import { MembershipNotFoundError } from "../../errors/membership-not-found.error";

describe("MembershipUseCase", () => {
    const membership1: CreateMembershipDTO = {
        userUID: "1",
        platformUID: "1",
        role: MembershipRole.OWNER,
    };

    const membership2: CreateMembershipDTO = {
        userUID: "2",
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
        const membership = expectSuccess(
            await useCase.create(membership1),
        );

        expect(membership).toHaveProperty("uid");
        expect(membership.uid).not.toEqual("");
    });

    test("should not allow duplicate membership", async () => {
        await useCase.create(membership1);

        expectFailure(await useCase.create({
            userUID: "1",
            platformUID: "1",
            role: MembershipRole.ADMIN,
        }), MembershipAlreadyExistsError);
    });

    test("should list memberships by platform", async () => {
        await useCase.create(membership1);

        await useCase.create(membership2);

        const memberships = expectSuccess(await useCase.listByPlatform(membership1.platformUID));

        expect(memberships.length).toBe(2);
    });

    test("should remove a membership", async () => {
        const created = expectSuccess(await useCase.create(membership1));

        expectSuccess(await useCase.delete(created.uid));

    });

    test("should return not found when removing missing membership", async () => {
        expectFailure(await useCase.delete("invalid-id"), MembershipNotFoundError);
        
    });
});
