import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

import { UserEntity } from "../entities/user.entity";

export type UpdateUserDTO = Partial<
    Pick<
        UserEntity,
        | "name"
        | "email"
        | "isActivated"
        | "password"
        | "docNumberBusiness"
        | "docNumberPerson"
        | "gender"
    >
> &
    Pick<UserEntity, "uid"> & { role?: MembershipRole };

export type UpdateUserResponseDTO = Pick<UserEntity, "uid" | "name" | "email" | "updatedAt">;
