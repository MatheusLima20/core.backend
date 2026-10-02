import { dataSource } from "@/services/database/database";

import { WeightStandardController } from "../controllers/weight-standard.controller";
import { WeightStandardEntity } from "../entities/weight-standard.entity";
import { TypeORMWeightStandardRepository } from "../repositories/implementations/type-orm-weight.repository";
import { WeightStandardUsecase } from "../usecases/weight-standard.usecase";

export function makeWeightStandardController() {
    const weightStandardRepository = new TypeORMWeightStandardRepository(
        dataSource.getRepository(WeightStandardEntity)
    );

    const usecase = new WeightStandardUsecase(weightStandardRepository);

    return new WeightStandardController(usecase);
}
