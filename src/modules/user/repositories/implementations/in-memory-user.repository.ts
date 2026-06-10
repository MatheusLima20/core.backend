import { CreateUserResponseDTO } from "../../dtos/create-user.dto";
import { UpdateUserResponseDTO } from "../../dtos/update-user.dto";
import { UserResponseDTO } from "../../dtos/user-response.dto copy";
import { UserEntity } from "../../entities/user.entity";
import { UserProps } from "../../entities/user.props";
import { Gender } from "../../enum/gender.enum";
import { UserType } from "../../enum/user-type.enum";
import { UserMapper } from "../../mappers/user.mapper";
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
    ];

    async findByUID(uid: string): Promise<UserResponseDTO | null> {
        const user = this.users.find((users) => users.uid === uid);

        if (!user) {
            return null;
        }

        return UserMapper.toUserFindResponse(user);
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        const user = this.users.find((users) => users.email === email);

        if (!user) {
            return null;
        }

        return UserMapper.toUserFindResponse(user);
    }
    async findByType(type: UserType): Promise<UserResponseDTO[]> {
        const users = this.users.filter((users) => users.userType === type);

        return UserMapper.toUserFindResponseList(users);
    }
    async find(platform: string): Promise<UserResponseDTO[]> {
        const users = this.users.filter(
            (users) => users.platformUID === platform,
        );

        return UserMapper.toUserFindResponseList(users);
    }
    async register(user: UserEntity): Promise<CreateUserResponseDTO | null> {
        this.users.push(user);

        return user;
    }
    async update(user: UserProps): Promise<UpdateUserResponseDTO | null> {
        const index = this.users.findIndex(
            (oldUser) => oldUser.uid === user.uid,
        );

        const updatedUser = (this.users[index] = user);

        return updatedUser;
    }
    async delete(uid: string): Promise<boolean> {
        const index = this.users.findIndex((oldUsers) => oldUsers.uid === uid);

        const removedUser = this.users.splice(index, 1);

        return !!removedUser;
    }
}
