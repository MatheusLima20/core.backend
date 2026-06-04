import { UserEntity } from "../entities/user.entity";

export type CreateUserDTO = Pick<
    UserEntity,
    | "name"
    | "email"
    | "password"
    | "docNumberBusiness"
    | "docNumberPerson"
    | "gender"
    | "userType"
    | "platformUID"
>;

export type CreateUserResponseDTO = Pick<
    UserEntity,
    "uid" | "name" | "email" | "userType"
>;
