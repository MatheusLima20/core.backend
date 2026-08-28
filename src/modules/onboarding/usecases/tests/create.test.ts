import { FakeHashProvider } from "@/modules/auth/providers/implementations/fake-hash.provider";
import { InMemoryFeedRepository } from "@/modules/farmora/feed/repositories/implementations/in-memory-feed.repository";
import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { PlatformCategory } from "@/modules/platform/enum/platform.category-enum";
import { InMemoryPlatformRepository } from "@/modules/platform/repositories/implementations/in-memory-platform.repository";
import { Gender } from "@/modules/user/enum/gender.enum";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { FakeTransactionManager } from "@/shared/database/transaction/implementations/fake-transaction-manager";
import { expectSuccess } from "@/shared/tests/result.helper";

import { CreatePlatformOwnerUseCase } from "../create-platform-owner.usecase";

describe("CreatePlatformOwnerUseCase", () => {
    let platformRepository: InMemoryPlatformRepository;
    let userRepository: InMemoryUserRepository;
    let membershipRepository: InMemoryMembershipRepository;

    let transactionManager: FakeTransactionManager;
    let hashProvider: FakeHashProvider;

    let usecase: CreatePlatformOwnerUseCase;

    let feedRepository: InMemoryFeedRepository;

    beforeEach(() => {
        platformRepository = new InMemoryPlatformRepository();

        userRepository = new InMemoryUserRepository();

        membershipRepository = new InMemoryMembershipRepository();

        feedRepository = new InMemoryFeedRepository();

        transactionManager = new FakeTransactionManager({
            platformRepository,
            feedRepository,
            userRepository,
            membershipRepository,
        });

        hashProvider = new FakeHashProvider();

        usecase = new CreatePlatformOwnerUseCase(transactionManager, hashProvider);
    });

    test("Should create a platform and its owner", async () => {
        const result = expectSuccess(
            await usecase.execute({
                platform: {
                    name: "Farmora",
                    category: PlatformCategory.FARMORA,
                },
                owner: {
                    name: "Matheus",
                    email: "matheus@email.com",
                    password: "12345678",
                    docNumberBusiness: null,
                    docNumberPerson: null,
                    gender: Gender.MALE,
                },
            })
        );

        expect(result.platform.uid).not.toBeNull();
        expect(result.platform.name).toBe("Farmora");

        expect(result.owner.uid).not.toBeNull();
        expect(result.owner.name).toBe("Matheus");
        expect(result.owner.email).toBe("matheus@email.com");
    });

    test("Should create an OWNER membership for the platform owner", async () => {
        const result = expectSuccess(
            await usecase.execute({
                platform: {
                    name: "Farmora",
                    category: PlatformCategory.FARMORA,
                },
                owner: {
                    name: "Matheus",
                    email: "matheus@email.com",
                    password: "12345678",
                    docNumberBusiness: null,
                    docNumberPerson: null,
                    gender: Gender.MALE,
                },
            })
        );

        const membershipResult = await membershipRepository.findByUserAndPlatform(
            result.owner.uid,
            result.platform.uid
        );

        const membership = expectSuccess(membershipResult);

        expect(membership).not.toBeNull();
        expect(membership?.userUID).toBe(result.owner.uid);
        expect(membership?.platformUID).toBe(result.platform.uid);
        expect(membership?.role).toBe(MembershipRole.OWNER);
    });
});
