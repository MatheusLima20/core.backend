import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindNutritionDTO } from "../dtos/find-nutrition.dto";
import { NutritionEntity } from "../entities/nutrition.entity";

export interface INutritionRepository {
    findByUID(uid: string): Promise<Result<NutritionEntity | null>>;

    find(filters?: FindNutritionDTO): Promise<Result<PaginationResult<NutritionEntity>>>;

    findByWeek(week: number): Promise<Result<NutritionEntity | null>>;
}
