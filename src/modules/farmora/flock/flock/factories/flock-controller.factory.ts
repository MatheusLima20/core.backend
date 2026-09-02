import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { FlockController } from "../controllers/flock.controller";
import { FlockEntity } from "../entities/flock.entity";
import { TypeORMFlockRepository } from "../repositories/implementations/type-orm-flock.repository";
import { FlockUsecase } from "../usecases/flock.usecase";

export function makeFlockController(context: RequestContext) {
    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const usecase = new FlockUsecase(context, flockRepository);

    return new FlockController(usecase);
}
