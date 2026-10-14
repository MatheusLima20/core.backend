import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { BreedEntity } from "../../breed/entities/breed.entity";
import { TypeORMBreedRepository } from "../../breed/repositories/implementations/type-orm-breed.repository";
import { FlockEntity } from "../../flock/entities/flock.entity";
import { TypeORMFlockRepository } from "../../flock/repositories/implementations/type-orm-flock.repository";
import { WeightController } from "../controllers/weight.controller";
import { WeightEntity } from "../entities/weight.entity";
import { TypeORMWeightRepository } from "../repositories/implementations/type-orm-weight.repository";
import { WeightUsecase } from "../usecases/weight.usecase";

export function makeWeightController(context: RequestContext) {
    const weightRepository = new TypeORMWeightRepository(dataSource.getRepository(WeightEntity));

    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const breedRepository = new TypeORMBreedRepository(dataSource.getRepository(BreedEntity));

    const usecase = new WeightUsecase(context, weightRepository, flockRepository, breedRepository);

    return new WeightController(usecase);
}
