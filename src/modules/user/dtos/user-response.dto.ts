import { UserProps } from "../entities/user.props";

export type UserResponseDTO = Pick<
    UserProps,
    | "uid"
    | "name"
    | "password"
    | "email"
    | "isActivated"
    | "gender"
    | "docNumberBusiness"
    | "docNumberPerson"
    | "createdAt"
    | "updatedAt"
>;
