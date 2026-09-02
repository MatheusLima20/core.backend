import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { FlockEntity } from "../../flock/entities/flock.entity";
import { TypeORMFlockRepository } from "../../flock/repositories/implementations/type-orm-flock.repository";
import { EggProductionController } from "../controllers/egg-production.controller";
import { EggProductionEntity } from "../entities/egg-production.entity";
import { TypeORMEggProductionRepository } from "../repositories/implementations/type-orm-egg-production.repository";
import { EggProductionUsecase } from "../usecases/egg-production.usecase";

export function makeEggProductionController(context: RequestContext) {
    const eggProductionRepository = new TypeORMEggProductionRepository(
        dataSource.getRepository(EggProductionEntity)
    );

    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const usecase = new EggProductionUsecase(context, eggProductionRepository, flockRepository);

    return new EggProductionController(usecase);
}
