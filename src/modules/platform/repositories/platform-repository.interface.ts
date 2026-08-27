import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result/result";

import { FindPlatformsDTO } from "../dto/find-platform.dto";
import { PlatformProps } from "../entities/platform.props";

export interface IPlatformRepository {
    findByUID(uid: string): Promise<Result<PlatformProps | null>>;

    findByName(name: string): Promise<Result<PlatformProps | null>>;

    find(
        platformUIDs: string[],
        data?: FindPlatformsDTO
    ): Promise<Result<PaginationResult<PlatformProps>>>;

    register(platform: PlatformProps): Promise<Result<PlatformProps>>;

    update(platform: PlatformProps): Promise<Result<PlatformProps>>;

    delete(uid: string): Promise<Result<boolean>>;
}
