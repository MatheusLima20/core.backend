import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { Gender } from "../../enum/gender.enum";
import { UserAlreadyExistsError } from "../../errors/user-already-exists.error";
import { UserNotFoundError } from "../../errors/user-not-found.error";
import { UserUseCase } from "../user.usecase";
import { makeUser, user1, user2 } from "./factories/user.factory";
import { setupUser, setupUsers } from "./setup/user.setup";
import { scenario } from "./setup/user.test-builder";

describe("UserUseCase", () => {
    let userUsecase: UserUseCase;

    beforeEach(async () => {
        const context = (await scenario().loadUsers(["1"])).createUsecases().build();

        userUsecase = context.userUsecases[0];
    });

    test("Should register an user", async () => {
        const result = expectSuccess(await userUsecase.create(user1));

        expect(result.name).toBe(user1.name);
        expect(result.email).toBe(user1.email);
        expect(result.uid).not.toBeNull();
    });

    test("Should not create duplicated user", async () => {
        await setupUser(userUsecase, user1);

        expectFailure(await userUsecase.create(user1), UserAlreadyExistsError);
    });

    test("Should update an user", async () => {
        const user = await setupUser(userUsecase, user1);

        const result = expectSuccess(
            await userUsecase.update({
                uid: user.uid,
                name: "Matheus Lima",
                email: "matheus.lima@gmail.com",
                password: "87654321",
                docNumberBusiness: null,
                docNumberPerson: 54879854,
                gender: Gender.MALE,
            })
        );

        expect(result.name).toBe("Matheus Lima");
        expect(result.email).toBe("matheus.lima@gmail.com");
        expect(result.uid).toBe(user.uid);
    });

    test("Should not update user with duplicated email", async () => {
        await setupUser(userUsecase, user1);

        const user = await setupUser(userUsecase, user2);

        const result = await userUsecase.update({
            uid: user.uid,
            name: user.name,
            email: user1.email,
            password: user1.password,
            docNumberBusiness: user1.docNumberBusiness,
            docNumberPerson: user1.docNumberPerson,
            gender: user1.gender,
        });

        const error = expectFailure(result, UserAlreadyExistsError);

        expect(error).toBeInstanceOf(UserAlreadyExistsError);
    });

    test("Should not update a non-existent user", async () => {
        const result = await userUsecase.update({
            uid: "not-found",
            name: "Unknown User",
            email: "unknown@example.com",
            password: "123456",
            docNumberBusiness: null,
            docNumberPerson: 123456789,
            gender: Gender.MALE,
        });

        const error = expectFailure(result, UserNotFoundError);

        expect(error).toBeInstanceOf(UserNotFoundError);
    });

    test("Should find an user by uid", async () => {
        const user = await setupUser(userUsecase, user1);

        const result = expectSuccess(await userUsecase.findByUID(user.uid));

        expect(result).not.toBeNull();
        expect(result?.uid).toBe(user.uid);
        expect(result?.name).toBe(user.name);
    });

    test("Should return null when user uid does not exist", async () => {
        const result = expectSuccess(await userUsecase.findByUID("not-found"));

        expect(result).toBeNull();
    });

    test("Should find an user by email", async () => {
        const user = await setupUser(userUsecase, user1);

        const result = expectSuccess(await userUsecase.findByEmail(user.email));

        expect(result).not.toBeNull();
        expect(result?.email).toBe(user.email);
        expect(result?.uid).toBe(user.uid);
    });

    test("Should return null when user email does not exist", async () => {
        const result = expectSuccess(await userUsecase.findByEmail("not-found@example.com"));

        expect(result).toBeNull();
    });

    test("Should delete an user", async () => {
        const user = await setupUser(userUsecase, user1);

        await setupUsers(
            userUsecase,
            user2,
            makeUser({
                name: "Customer",
                email: "customer@example.com",
            })
        );

        const result = expectSuccess(await userUsecase.delete(user.uid));

        expect(result).toBe(true);

        const deletedUser = expectSuccess(await userUsecase.findByUID(user.uid));

        expect(deletedUser).toBe(null);
    });

    test("Should not delete a non-existent user", async () => {
        const result = await userUsecase.delete("not-found");

        const error = expectFailure(result, UserNotFoundError);

        expect(error).toBeInstanceOf(UserNotFoundError);
    });
});
