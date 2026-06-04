import { UserResponseDTO } from "../dtos/user-response.dto copy";
import { UserEntity } from "../entities/user.entity";



export const UserMapper = {

    toUserFindResponse: (
        user: UserEntity,
    ): UserResponseDTO => {

        return {
            uid: user.uid,
            name: user.name,
            platformUID: user.platformUID,
            email: user.email,
            gender: user.gender,
            docNumberBusiness: user.docNumberBusiness,
            docNumberPerson: user.docNumberPerson,
            userType: user.userType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    toUserFindResponseList: (
        users: UserEntity[],
    ): UserResponseDTO[] => {

        return users.map(
            UserMapper.toUserFindResponse
        );
    },
};