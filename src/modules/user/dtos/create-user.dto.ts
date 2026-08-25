import { UserProps } from "../entities/user.props";

export type CreateUserDTO = Pick<
    UserProps,
    "name" | "email" | "password" | "docNumberBusiness" | "docNumberPerson" | "gender" | "userType"
>;

export type CreateUserResponseDTO = Pick<UserProps, "uid" | "name" | "email" | "userType">;
