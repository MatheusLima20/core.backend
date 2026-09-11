import { CreateUserResponseDTO } from "../dtos/create-user.dto";
import { UpdateUserResponseDTO } from "../dtos/update-user.dto";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { UserEntity } from "../entities/user.entity";

export const UserMapper = {
    toUserResponseDTO: (user: UserEntity): UserResponseDTO => {
        return {
            uid: user.uid,
            name: user.name,
            password: user.password,
            email: user.email,
            isActivated: user.isActivated,
            gender: user.gender,
            docNumberBusiness: user.docNumberBusiness,
            docNumberPerson: user.docNumberPerson,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toUserFindResponseList: (users: UserEntity[]): UserResponseDTO[] => {
        return users.map(UserMapper.toUserResponseDTO);
    },

    toCreateUserResponseDTO: (user: UserEntity): CreateUserResponseDTO => {
        return {
            uid: user.uid,
            email: user.email,
            name: user.name,
        };
    },

    toUpdateUserResponseDTO: (user: UserEntity): UpdateUserResponseDTO => {
        return {
            uid: user.uid,
            email: user.email,
            name: user.name,
            updatedAt: user.updatedAt,
        };
    },
};
