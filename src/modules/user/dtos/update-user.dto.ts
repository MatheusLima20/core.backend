import { UserProps } from "../entities/user.props";


export type UpdateUserDTO = Pick<
    UserProps,
    | "uid"
    | "name"
    | "email"
    | "password"
    | "docNumberBusiness"
    | "docNumberPerson"
    | "gender"
    | "userType"
>;

export type UpdateUserResponseDTO = Pick<
    UserProps,
    "uid" | "name" | "email" | "userType" | "updatedAt"
>;
