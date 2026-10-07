import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { FlockBreedEntity } from "../../flock-breed/entities/flock-breed.entity";
import { TypeORMFlockBreedRepository } from "../../flock-breed/repositories/implementations/type-orm-flock-breed.repository";
import { FlockController } from "../controllers/flock.controller";
import { FlockEntity } from "../entities/flock.entity";
import { TypeORMFlockRepository } from "../repositories/implementations/type-orm-flock.repository";
import { FlockUsecase } from "../usecases/flock.usecase";

export function makeFlockController(context: RequestContext) {
    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));
    const flockBreedRepository = new TypeORMFlockBreedRepository(
        dataSource.getRepository(FlockBreedEntity)
    );

    const usecase = new FlockUsecase(context, flockRepository, flockBreedRepository);

    return new FlockController(usecase);
}
