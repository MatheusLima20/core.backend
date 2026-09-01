import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { BreedEntity } from "../entities/breed.entity";

export interface IBreedRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<BreedEntity | null>>;

    findByName(platformUID: string, name: string): Promise<Result<BreedEntity | null>>;

    find(
        platformUID: string,
        filters?: FindBreedsDTO
    ): Promise<Result<PaginationResult<BreedEntity>>>;

    register(breed: BreedEntity): Promise<Result<BreedEntity>>;

    update(breed: BreedEntity): Promise<Result<BreedEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
