import { PlatformProps } from "@/modules/platform/entities/platform.props";
import { UserProps } from "@/modules/user/entities/user.props";

export type CreatePlatformOwnerDTO = {
    platform: Pick<PlatformProps, "name" | "category">;

    owner: Pick<
        UserProps,
        | "name"
        | "email"
        | "password"
        | "docNumberBusiness"
        | "docNumberPerson"
        | "gender"
        | "userType"
    >;
};

export type CreatePlatformOwnerResponseDTO = {
    platform: Pick<PlatformProps, "uid" | "name" | "category">;

    owner: Pick<UserProps, "uid" | "name" | "email" | "userType" | "platformUID">;
};
