import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { UserProps } from "../../entities/user.props";
import { Gender } from "../../enum/gender.enum";
import { UserType } from "../../enum/user-type.enum";
import { IUserRepository } from "../user-repository-interface";

export class InMemoryUserRepository implements IUserRepository {
    private users: UserProps[] = [
        {
            uid: "1",
            name: "Matheus",
            email: "matheus@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            userType: UserType.ADMINISTRATOR,
            platformUID: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "2",
            name: "Joan",
            email: "joan@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            userType: UserType.ADMINISTRATOR,
            platformUID: "2",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "3",
            name: "Nara",
            email: "nara@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.FEMALE,
            userType: UserType.ADMINISTRATOR,
            platformUID: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async findByUID(uid: string): Promise<Result<UserProps | null>> {
        const user = this.users.find((users) => users.uid === uid);

        if (!user) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(user);
    }

    async findByEmail(email: string): Promise<Result<UserProps | null>> {
        const user = this.users.find((users) => users.email === email);

        if (!user) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(user);
    }

    async findByPlatformUIDAndEmail(
        platformUID: string,
        email: string
    ): Promise<Result<UserProps | null>> {
        const users = this.users.filter((users) => users.platformUID === platformUID);

        const user = users.find((users) => users.email === email);

        if (!user) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(user);
    }

    async findByType(platformUID: string, type: UserType): Promise<Result<UserProps[]>> {
        const allUsers = this.users.filter((users) => users.platformUID === platformUID);

        const users = allUsers.filter((users) => users.userType === type);

        return ResultFactory.success(users);
    }
    async find(platform: string): Promise<Result<UserProps[]>> {
        const users = this.users.filter((users) => users.platformUID === platform);

        return ResultFactory.success(users);
    }
    async register(user: UserProps): Promise<Result<UserProps>> {
        this.users.push(user);

        return ResultFactory.success(user);
    }
    async update(user: UserProps): Promise<Result<UserProps>> {
        const index = this.users.findIndex((oldUser) => oldUser.uid === user.uid);

        this.users[index] = user;

        return ResultFactory.success(user);
    }
    async delete(uid: string): Promise<Result<boolean>> {
        const index = this.users.findIndex((user) => user.uid === uid);

        if (index === -1) {
            return ResultFactory.success(false);
        }

        this.users.splice(index, 1);

        return ResultFactory.success(true);
    }
}
