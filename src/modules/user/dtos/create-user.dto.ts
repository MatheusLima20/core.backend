import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

import { UserProps } from "../entities/user.props";

export type CreateUserDTO = Pick<
    UserProps,
    "name" | "email" | "password" | "docNumberBusiness" | "docNumberPerson" | "gender"
> & {
    role?: MembershipRole;
};

export type CreateUserResponseDTO = Pick<UserProps, "uid" | "name" | "email">;
