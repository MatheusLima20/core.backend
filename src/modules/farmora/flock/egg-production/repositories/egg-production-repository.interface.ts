import { Result } from "@/shared/result";

import { FindEggProductionsDTO } from "../dtos/find-egg-production.dto";
import { EggProductionProps } from "../entities/egg-production.props";

export interface IEggProductionRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<EggProductionProps | null>>;

    findByFlockAndDate(
        platformUID: string,
        flockUID: string,
        productionDate: Date
    ): Promise<Result<EggProductionProps | null>>;

    find(
        platformUID: string,
        filters?: FindEggProductionsDTO
    ): Promise<Result<EggProductionProps[]>>;

    register(eggProduction: EggProductionProps): Promise<Result<EggProductionProps>>;

    update(eggProduction: EggProductionProps): Promise<Result<EggProductionProps>>;

    delete(uid: string): Promise<Result<void>>;
}
