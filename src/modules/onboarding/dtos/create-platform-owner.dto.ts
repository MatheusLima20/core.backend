import { PlatformEntity } from "@/modules/platform/entities/platform.entity";
import { UserEntity } from "@/modules/user/entities/user.entity";

export type CreatePlatformOwnerDTO = {
    platform: Pick<PlatformEntity, "name" | "category">;

    owner: Pick<
        UserEntity,
        "name" | "email" | "password" | "docNumberBusiness" | "docNumberPerson" | "gender"
    >;
};

export type CreatePlatformOwnerResponseDTO = {
    platform: Pick<PlatformEntity, "uid" | "name" | "category">;

    owner: Pick<UserEntity, "uid" | "name" | "email">;
};
