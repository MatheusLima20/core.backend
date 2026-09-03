import { dataSource } from "@/services/database/database";

import { NutritionController } from "../controller/nutrition.controller";
import { NutritionEntity } from "../entities/nutrition.entity";
import { TypeORMNutritionRepository } from "../repositories/implementations/type-orm-nutrition.repository";
import { NutritionUsecase } from "../usecases/nutrition.usecase";

export function makeNutritionController() {
    const nutritionRepository = new TypeORMNutritionRepository(
        dataSource.getRepository(NutritionEntity)
    );

    const usecase = new NutritionUsecase(nutritionRepository);

    return new NutritionController(usecase);
}
