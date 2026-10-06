import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindFlockBreedsDTO } from "../dtos/find-flock-breeds.dto";
import { FlockBreedEntity } from "../entities/flock-breed.entity";

export interface IFlockBreedRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<FlockBreedEntity | null>>;

    findByFlockAndBreed(
        platformUID: string,
        flockUID: string,
        breedUID: string
    ): Promise<Result<FlockBreedEntity | null>>;

    find(
        platformUID: string,
        filters?: FindFlockBreedsDTO
    ): Promise<Result<PaginationResult<FlockBreedEntity>>>;

    register(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>>;

    update(flockBreed: FlockBreedEntity): Promise<Result<FlockBreedEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
