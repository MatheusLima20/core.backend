import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindUsersDTO } from "../dtos/find-users.dto";
import { UserProps } from "../entities/user.props";

export interface IUserRepository {
    findByUID(uid: string): Promise<Result<UserProps | null>>;
    findByUIDs(uids: string[], data?: FindUsersDTO): Promise<Result<PaginationResult<UserProps>>>;
    findByEmail(email: string): Promise<Result<UserProps | null>>;
    register(user: UserProps): Promise<Result<UserProps>>;
    update(user: UserProps): Promise<Result<UserProps>>;
    delete(uid: string): Promise<Result<boolean>>;
}
