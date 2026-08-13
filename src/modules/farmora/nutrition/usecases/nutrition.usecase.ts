import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { FindNutritionDTO } from "../dtos/find-nutrition.dto";
import { ResponseNutritionDTO } from "../dtos/response-nutrition.dto";
import { NutritionNotFoundError } from "../errors/nutrition-not-found.error";
import { NutritionMapper } from "../mappers/nutrition.mapper";
import { INutritionRepository } from "../repositories/nutrition-repository.interface";

export class NutritionUsecase {
    constructor(private readonly nutritionRepository: INutritionRepository) {}

    async findByUID(uid: string): Promise<Result<ResponseNutritionDTO | null>> {
        const result = await this.nutritionRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        if (!result.data) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(ResultFactory.success(result.data), NutritionMapper.toResponseDTO);
    }

    async find(filters?: FindNutritionDTO): Promise<Result<ResponseNutritionDTO[]>> {
        const result = await this.nutritionRepository.find(filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch nutritious."));
        }

        return ResultMapper.map(result, NutritionMapper.toResponseDTOList);
    }

    async findByWeek(week: number): Promise<Result<ResponseNutritionDTO>> {
        const result = await this.nutritionRepository.findByWeek(week);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch nutrition."));
        }

        const requiredNutrition = ResultMapper.requireData(result, new NutritionNotFoundError({}));

        if (isFailure(requiredNutrition)) {
            return requiredNutrition;
        }

        return ResultMapper.map(requiredNutrition, NutritionMapper.toResponseDTO);
    }
}
