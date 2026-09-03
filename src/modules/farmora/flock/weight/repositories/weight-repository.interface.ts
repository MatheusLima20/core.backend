import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindWeightsDTO } from "../dtos/find-weights.dto";
import { WeightEntity } from "../entities/weight.entity";

export interface IWeightRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<WeightEntity | null>>;

    find(
        platformUID: string,
        filters?: FindWeightsDTO
    ): Promise<Result<PaginationResult<WeightEntity>>>;

    exists(
        platformUID: string,
        data: {
            flockUID: string;
            weighingDate: Date;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>>;

    register(weight: WeightEntity): Promise<Result<WeightEntity>>;

    update(weight: WeightEntity): Promise<Result<WeightEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
