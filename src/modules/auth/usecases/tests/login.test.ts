import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryPlatformRepository } from "@/modules/platform/repositories/implementations/in-memory-platform.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { InvalidCredentialsError } from "../../errors/invalid-credentials.error";
import { FakeHashProvider } from "../../providers/implementations/fake-hash.provider";
import { FakeTokenProvider } from "../../providers/implementations/fake-token.provider";
import { LoginUsecase } from "../login.usecase";

describe("LoginUseCase", () => {
    let userRepository: InMemoryUserRepository;
    let membershipRepository: InMemoryMembershipRepository;

    let hashProvider: FakeHashProvider;
    let tokenProvider: FakeTokenProvider;

    let usecase: LoginUsecase;

    let platformRepository: InMemoryPlatformRepository;

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        membershipRepository = new InMemoryMembershipRepository();
        platformRepository = new InMemoryPlatformRepository();

        hashProvider = new FakeHashProvider();
        tokenProvider = new FakeTokenProvider();

        usecase = new LoginUsecase(
            userRepository,
            membershipRepository,
            platformRepository,
            hashProvider,
            tokenProvider
        );
    });

    test("Should login successfully", async () => {
        const result = expectSuccess(await usecase.execute("matheus@email.com", "12345678"));

        expect(result.token).toContain("token");
    });

    test("Should not login when user does not exist", async () => {
        expectFailure(
            await usecase.execute("notfound@email.com", "123456"),
            InvalidCredentialsError
        );
    });

    test("Should not login with wrong password", async () => {
        expectFailure(
            await usecase.execute("matheus@email.com", "wrong_12345678"),
            InvalidCredentialsError
        );
    });
});
