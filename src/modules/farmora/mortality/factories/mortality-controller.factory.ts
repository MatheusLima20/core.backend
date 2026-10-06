import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { FlockEntity } from "../../flock/entities/flock.entity";
import { TypeORMFlockRepository } from "../../flock/repositories/implementations/type-orm-flock.repository";
import { MortalityController } from "../controllers/mortality.controller";
import { MortalityEntity } from "../entities/mortality.entity";
import { TypeORMMortalityRepository } from "../repositories/implementations/type-orm-mortality.repository";
import { MortalityUsecase } from "../usecases/mortality.usecase";

export function makeMortalityController(context: RequestContext) {
    const mortalityRepository = new TypeORMMortalityRepository(
        dataSource.getRepository(MortalityEntity)
    );

    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const usecase = new MortalityUsecase(context, mortalityRepository, flockRepository);

    return new MortalityController(usecase);
}
