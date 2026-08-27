import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
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

    const platformUID = "platform-1";

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        membershipRepository = new InMemoryMembershipRepository();

        hashProvider = new FakeHashProvider();
        tokenProvider = new FakeTokenProvider();

        usecase = new LoginUsecase(
            userRepository,
            membershipRepository,
            hashProvider,
            tokenProvider
        );
    });

    test("Should login successfully", async () => {
        const result = expectSuccess(
            await usecase.execute("matheus@email.com", "12345678", platformUID)
        );

        expect(result.token).toContain("token");
    });

    test("Should not login when user does not exist", async () => {
        expectFailure(
            await usecase.execute("notfound@email.com", "123456", platformUID),
            InvalidCredentialsError
        );
    });

    test("Should not login with wrong password", async () => {
        expectFailure(
            await usecase.execute("matheus@email.com", "wrong_12345678", platformUID),
            InvalidCredentialsError
        );
    });
});
