import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result/result";

import { FindPlatformsDTO } from "../dto/find-platform.dto";
import { PlatformEntity } from "../entities/platform.entity";

export interface IPlatformRepository {
    findByUID(uid: string): Promise<Result<PlatformEntity | null>>;

    findByName(name: string): Promise<Result<PlatformEntity | null>>;

    find(
        platformUIDs: string[],
        data?: FindPlatformsDTO
    ): Promise<Result<PaginationResult<PlatformEntity>>>;

    register(platform: PlatformEntity): Promise<Result<PlatformEntity>>;

    update(platform: PlatformEntity): Promise<Result<PlatformEntity>>;

    delete(uid: string): Promise<Result<boolean>>;
}
