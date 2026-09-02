import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindEggProductionsDTO } from "../dtos/find-egg-production.dto";
import { EggProductionEntity } from "../entities/egg-production.entity";

export interface IEggProductionRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<EggProductionEntity | null>>;

    findByFlockAndDate(
        platformUID: string,
        flockUID: string,
        productionDate: Date
    ): Promise<Result<EggProductionEntity | null>>;

    find(
        platformUID: string,
        filters?: FindEggProductionsDTO
    ): Promise<Result<PaginationResult<EggProductionEntity>>>;

    register(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>>;

    update(eggProduction: EggProductionEntity): Promise<Result<EggProductionEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
