import { Result } from "@/shared/result";

import { FindNutritionDTO } from "../dtos/find-nutrition.dto";
import { NutritionProps } from "../entities/nutrition.props";

export interface INutritionRepository {
    findByUID(uid: string): Promise<Result<NutritionProps | null>>;

    find(filters?: FindNutritionDTO): Promise<Result<NutritionProps[]>>;

    findByWeek(week: number): Promise<Result<NutritionProps | null>>;
}
