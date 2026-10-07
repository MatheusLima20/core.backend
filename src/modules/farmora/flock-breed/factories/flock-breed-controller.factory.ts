import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { BreedEntity } from "../../breed/entities/breed.entity";
import { TypeORMBreedRepository } from "../../breed/repositories/implementations/type-orm-breed.repository";
import { FlockEntity } from "../../flock/entities/flock.entity";
import { TypeORMFlockRepository } from "../../flock/repositories/implementations/type-orm-flock.repository";
import { FlockBreedController } from "../controllers/flock-breed.controller";
import { FlockBreedEntity } from "../entities/flock-breed.entity";
import { TypeORMFlockBreedRepository } from "../repositories/implementations/type-orm-flock-breed.repository";
import { FlockBreedUsecase } from "../usecases/flock-breed.usecase";

export function makeFlockBreedController(context: RequestContext) {
    const flockBreedRepository = new TypeORMFlockBreedRepository(
        dataSource.getRepository(FlockBreedEntity)
    );

    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const breedRepository = new TypeORMBreedRepository(dataSource.getRepository(BreedEntity));

    const usecase = new FlockBreedUsecase(
        context,
        flockBreedRepository,
        flockRepository,
        breedRepository
    );

    return new FlockBreedController(usecase);
}
