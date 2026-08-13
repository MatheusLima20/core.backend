import { ResponseNutritionDTO } from "../dtos/response-nutrition.dto";
import { NutritionProps } from "../entities/nutrition.props";

export const NutritionMapper = {
    toResponseDTO: (nutrition: NutritionProps): ResponseNutritionDTO => {
        return {
            uid: nutrition.uid,

            name: nutrition.name,

            startWeek: nutrition.startWeek,
            endWeek: nutrition.endWeek,

            minimumCrudeProtein: nutrition.minimumCrudeProtein,
            maximumCrudeProtein: nutrition.maximumCrudeProtein,

            metabolizableEnergy: nutrition.metabolizableEnergy,
            crudeFiber: nutrition.crudeFiber,

            calcium: nutrition.calcium,
            phosphorus: nutrition.phosphorus,
            sodium: nutrition.sodium,

            lysine: nutrition.lysine,
            methionine: nutrition.methionine,

            createdAt: nutrition.createdAt,
            updatedAt: nutrition.updatedAt,
        };
    },

    toResponseDTOList: (nutritious: NutritionProps[]): ResponseNutritionDTO[] => {
        return nutritious.map(NutritionMapper.toResponseDTO);
    },
};
