import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindUsersDTO } from "../dtos/find-users.dto";
import { UserEntity } from "../entities/user.entity";

export interface IUserRepository {
    findByUID(uid: string): Promise<Result<UserEntity | null>>;
    findByUIDs(uids: string[], data?: FindUsersDTO): Promise<Result<PaginationResult<UserEntity>>>;
    findByEmail(email: string): Promise<Result<UserEntity | null>>;
    register(user: UserEntity): Promise<Result<UserEntity>>;
    update(user: UserEntity): Promise<Result<UserEntity>>;
    delete(uid: string): Promise<Result<boolean>>;
}
