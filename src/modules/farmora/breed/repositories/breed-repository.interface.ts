import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { BreedEntity } from "../entities/breed.entity";

export interface IBreedRepository {
    find(filters?: FindBreedsDTO): Promise<Result<PaginationResult<BreedEntity>>>;

    findByUID(uid: string): Promise<Result<BreedEntity | null>>;
}
