import { Result } from "@/shared/result";

import { UserProps } from "../entities/user.props";
import { UserType } from "../enum/user-type.enum";

export interface IUserRepository {
    findByUID(uid: string): Promise<Result<UserProps | null>>;
    findByEmail(email: string): Promise<Result<UserProps | null>>;
    findByPlatformUIDAndEmail(
        platformUID: string,
        email: string
    ): Promise<Result<UserProps | null>>;
    findByType(platformUID: string, type: UserType): Promise<Result<UserProps[]>>;
    find(platform: string): Promise<Result<UserProps[]>>;
    register(user: UserProps): Promise<Result<UserProps>>;
    update(user: UserProps): Promise<Result<UserProps>>;
    delete(uid: string): Promise<Result<boolean>>;
}
