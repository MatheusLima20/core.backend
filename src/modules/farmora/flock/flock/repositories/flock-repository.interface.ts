import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindFlocksDTO } from "../dtos/find-flock.dto";
import { FlockEntity } from "../entities/flock.entity";
import { FlockWithBreed } from "../types/flock-with.breed";

export interface IFlockRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<FlockEntity | null>>;

    findByName(platformUID: string, name: string): Promise<Result<FlockEntity[]>>;

    find(
        platformUID: string,
        filters?: FindFlocksDTO
    ): Promise<Result<PaginationResult<FlockWithBreed>>>;

    register(flock: FlockEntity): Promise<Result<FlockEntity>>;

    update(flock: FlockEntity): Promise<Result<FlockEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
