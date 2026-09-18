import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

import { UserEntity } from "../entities/user.entity";

export type CreateUserDTO = Pick<
    UserEntity,
    "name" | "email" | "password" | "docNumberBusiness" | "docNumberPerson" | "gender"
> & {
    role?: MembershipRole;
};

export type CreateUserResponseDTO = Pick<UserEntity, "uid" | "name" | "email">;
