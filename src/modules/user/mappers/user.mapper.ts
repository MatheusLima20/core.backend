import { UserResponseDTO } from "../dtos/user-response.dto copy";
import { UserProps } from "../entities/user.props";



export const UserMapper = {

    toUserFindResponse: (
        user: UserProps,
    ): UserResponseDTO => {

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

    toUserFindResponseList: (
        users: UserProps[],
    ): UserResponseDTO[] => {

        return users.map(
            UserMapper.toUserFindResponse
        );
    },
};