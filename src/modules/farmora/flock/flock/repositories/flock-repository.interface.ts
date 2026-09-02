import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindFlocksDTO } from "../dtos/find-flock.dto";
import { FlockEntity } from "../entities/flock.entity";

export interface IFlockRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<FlockEntity | null>>;

    findByName(platformUID: string, name: string): Promise<Result<FlockEntity[]>>;

    find(
        platformUID: string,
        filters?: FindFlocksDTO
    ): Promise<Result<PaginationResult<FlockEntity>>>;

    register(flock: FlockEntity): Promise<Result<FlockEntity>>;

    update(flock: FlockEntity): Promise<Result<FlockEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
