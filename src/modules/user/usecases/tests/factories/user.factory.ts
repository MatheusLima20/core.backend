import { CreateUserDTO } from "../../../dtos/create-user.dto";
import { Gender } from "../../../enum/gender.enum";
import { UserType } from "../../../enum/user-type.enum";

export const user1: CreateUserDTO = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "123456",
    docNumberBusiness: null,
    docNumberPerson: 123456789,
    gender: Gender.MALE,
    userType: UserType.OWNER,
    platformUID: "platform-1",
};

export const user2: CreateUserDTO = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: "123456",
    docNumberBusiness: null,
    docNumberPerson: 987654321,
    gender: Gender.FEMALE,
    userType: UserType.MANAGER,
    platformUID: "platform-1",
};

export function makeUser(data?: Partial<CreateUserDTO>): CreateUserDTO {
    return {
        ...user1,
        ...data,
    };
}
