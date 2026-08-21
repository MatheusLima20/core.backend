import { UserProps } from "../entities/user.props";


export type UserResponseDTO = Pick<
    UserProps,
    | "uid"
    | "name"
    | "password"
    | "email"
    | "userType"
    | "gender"
    | "platformUID"
    | "docNumberBusiness"
    | "docNumberPerson"
    | "createdAt"
    | "updatedAt"
>;
