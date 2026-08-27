import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

import { UserProps } from "../entities/user.props";

export type UpdateUserDTO = Partial<
    Pick<
        UserProps,
        | "name"
        | "email"
        | "isActivated"
        | "password"
        | "docNumberBusiness"
        | "docNumberPerson"
        | "gender"
    >
> &
    Pick<UserProps, "uid"> & { role?: MembershipRole };

export type UpdateUserResponseDTO = Pick<UserProps, "uid" | "name" | "email" | "updatedAt">;
