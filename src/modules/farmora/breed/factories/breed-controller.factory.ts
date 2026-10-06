import { dataSource } from "@/services/database/database";

import { BreedController } from "../controllers/breed.controller";
import { BreedEntity } from "../entities/breed.entity";
import { TypeORMBreedRepository } from "../repositories/implementations/type-orm-breed.repository";
import { BreedUsecase } from "../usecases/breed.usecase";

export function makeBreedController() {
    const breedRepository = new TypeORMBreedRepository(dataSource.getRepository(BreedEntity));

    const usecase = new BreedUsecase(breedRepository);

    return new BreedController(usecase);
}
