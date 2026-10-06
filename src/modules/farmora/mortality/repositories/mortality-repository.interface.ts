import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindMortalitiesDTO } from "../dtos/find-mortality.dto";
import { MortalityEntity } from "../entities/mortality.entity";

export interface IMortalityRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<MortalityEntity | null>>;

    find(
        platformUID: string,
        filters?: FindMortalitiesDTO
    ): Promise<Result<PaginationResult<MortalityEntity>>>;

    register(mortality: MortalityEntity): Promise<Result<MortalityEntity>>;

    update(mortality: MortalityEntity): Promise<Result<MortalityEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
