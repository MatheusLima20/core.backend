import { Equal } from "typeorm";
import { CreateUserDTO } from "../../dtos/create-user.dto";
import { Gender } from "../../enum/gender.enum";
import { UserType } from "../../enum/user-type.enum";
import { InMemoryUserRepository } from "../../repositories/implementations/in-memory-user.repository";
import { UserUseCase } from "../user.usecase";
import { UpdateUserDTO } from "../../dtos/update-user.dto";

const user: CreateUserDTO = {
    platformUID: "1",
    name: "Matheus Santos",
    docNumberBusiness: null,
    docNumberPerson: 54879854,
    email: "matheus2096lima@gmail.com",
    gender: Gender.MALE,
    password: "12345678",
    userType: UserType.ADMINISTRATOR,
};

const user2: CreateUserDTO = {
    ...user,
    name: "Michael Jackson",
    password: "87654321",
    docNumberBusiness: 987548987895,
    docNumberPerson: null,
    email: "michael.jack@gmail.com",
};

const makeUser = (data?: Partial<CreateUserDTO>): CreateUserDTO => ({
    ...user,
    ...data,
});

describe("UserUsecase", () => {
    let repository: InMemoryUserRepository;

    let useCase: UserUseCase;

    beforeEach(() => {
        repository = new InMemoryUserRepository();

        useCase = new UserUseCase(repository);
    });

    test("should register an user", async () => {
        const result = await useCase.create(user);

        expect(result.name).toBe(user.name);
    });

    test("should to update an user", async () => {
        const registeredUser = await useCase.create(user);
        const registeredUser2 = await useCase.create(user2);
        await useCase.create(
            makeUser({
                name: "Ramon Dias",
                email: "ramon.dias@gmail.com",
                docNumberPerson: 458798755,
            }),
        );

        const userToUpdate: UpdateUserDTO = {
            ...registeredUser,
            name: "Matheus Lima",
            password: "",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            email: "matheus2096lima@gmail.com",
        };

        const userToUpdate2: UpdateUserDTO = {
            ...registeredUser2,
            name: "Matheus Santos",
            password: "",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            email: "matheus2096santos@gmail.com",
        };

        const result = await useCase.update(userToUpdate);

        const result2 = await useCase.update(userToUpdate2);

        expect(result.name).toBe(userToUpdate.name);
        expect(result2.name).toBe(userToUpdate2.name);
    });

    test("should to get all registered users", async () => {
        await useCase.create(user);
        await useCase.create(user2);
        await useCase.create(
            makeUser({
                name: "Ramon Dias",
                email: "ramon.dias@gmail.com",
                docNumberPerson: 458798755,
            }),
        );

        const result = await useCase.find("1");

        expect(result).toHaveLength(3);
    });

    test("should to get all registered users by type", async () => {
        await useCase.create(user);
        await useCase.create(user2);
        await useCase.create(
            makeUser({
                name: "Ramon Dias",
                email: "ramon.dias@gmail.com",
                docNumberPerson: 458798755,
                userType: UserType.CUSTOMER,
            }),
        );

        const results = await useCase.findByType(UserType.ADMINISTRATOR);

        expect(
            results.every(
                (result) => result.userType === UserType.ADMINISTRATOR,
            ),
        ).toBe(true);
    });

    test("should to get user registered by email", async () => {
        await useCase.create(user);
        await useCase.create(user2);
        await useCase.create(
            makeUser({
                name: "Ramon Dias",
                email: "ramon.dias@gmail.com",
                docNumberPerson: 458798755,
                userType: UserType.CUSTOMER,
            }),
        );

        const result = await useCase.findByEmail(user.email);

        expect(result.email).toBe(user.email);
    });

    test("Should to delete an user", async () => {
        const deleteUser = await useCase.create(user);
        const deleteUser2 = await useCase.create(user2);
        await useCase.create(
            makeUser({
                name: "Ramon Dias",
                email: "ramon.dias@gmail.com",
                docNumberPerson: 458798755,
                userType: UserType.CUSTOMER,
            }),
        );

        const isDeletedUser = await useCase.delete(deleteUser.uid);
        const isDeletedUser2 = await useCase.delete(deleteUser2.uid);

        expect(isDeletedUser2).toBe(true);
        expect(isDeletedUser).toBe(true);
    });
});
