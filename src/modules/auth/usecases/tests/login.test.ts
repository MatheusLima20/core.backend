import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { InvalidCredentialsError } from "../../errors/invalid-credentials.error";
import { FakeHashProvider } from "../../providers/implementations/fake-hash.provider";
import { FakeTokenProvider } from "../../providers/implementations/fake-token.provider";
import { LoginUsecase } from "../login.usecase";

describe("LoginUseCase", () => {
    let repository: InMemoryUserRepository;

    let hashProvider: FakeHashProvider;

    let tokenProvider: FakeTokenProvider;

    let usecase: LoginUsecase;

    beforeEach(() => {
        repository = new InMemoryUserRepository();

        hashProvider = new FakeHashProvider();

        tokenProvider = new FakeTokenProvider();

        usecase = new LoginUsecase(repository, hashProvider, tokenProvider);
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
