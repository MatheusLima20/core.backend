import { FakeHashProvider } from "@/modules/auth/providers/implementations/fake-hash.provider";
import { PlatformCategory } from "@/modules/platform/enum/platform.category-enum";
import { InMemoryPlatformRepository } from "@/modules/platform/repositories/implementations/in-memory-platform.repository";
import { Gender } from "@/modules/user/enum/gender.enum";
import { UserType } from "@/modules/user/enum/user-type.enum";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { expectSuccess } from "@/shared/tests/result.helper";

import { CreatePlatformOwnerUseCase } from "../create-platform-owner.usecase";

describe("CreatePlatformOwnerUseCase", () => {
    let platformRepository: InMemoryPlatformRepository;
    let userRepository: InMemoryUserRepository;
    let hashProvider: FakeHashProvider;

    let usecase: CreatePlatformOwnerUseCase;

    beforeEach(() => {
        platformRepository = new InMemoryPlatformRepository();

        userRepository = new InMemoryUserRepository();

        hashProvider = new FakeHashProvider();

        usecase = new CreatePlatformOwnerUseCase(platformRepository, userRepository, hashProvider);
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
        expect(result.owner.userType).toBe(UserType.OWNER);

        expect(result.owner.platformUID).toBe(result.platform.uid);
    });
});
