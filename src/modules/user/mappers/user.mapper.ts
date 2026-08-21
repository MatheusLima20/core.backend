import { CreateUserResponseDTO } from "../dtos/create-user.dto";
import { UpdateUserResponseDTO } from "../dtos/update-user.dto";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { UserProps } from "../entities/user.props";

export const UserMapper = {
    toUserFindResponse: (user: UserProps): UserResponseDTO => {
        return {
            uid: user.uid,
            name: user.name,
            platformUID: user.platformUID,
            email: user.email,
            password: user.password,
            gender: user.gender,
            docNumberBusiness: user.docNumberBusiness,
            docNumberPerson: user.docNumberPerson,
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toUserFindResponseList: (users: UserProps[]): UserResponseDTO[] => {
        return users.map(UserMapper.toUserFindResponse);
    },

    toCreateUserResponseDTO: (user: UserProps): CreateUserResponseDTO => {
        return {
            uid: user.uid,
            email: user.email,
            name: user.name,
            userType: user.userType,
        };
    },

    toUpdateUserResponseDTO: (user: UserProps): UpdateUserResponseDTO => {
        return {
            uid: user.uid,
            email: user.email,
            name: user.name,
            userType: user.userType,
            updatedAt: user.updatedAt,
        };
    },
};
