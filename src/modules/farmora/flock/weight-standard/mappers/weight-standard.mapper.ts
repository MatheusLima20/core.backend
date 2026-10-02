import { ResponseWeightStandardDTO } from "../dtos/response-weight-standard.dto";
import { WeightStandardEntity } from "../entities/weight-standard.entity";

export const WeightStandardMapper = {
    toResponseDTO: (weightStandard: WeightStandardEntity): ResponseWeightStandardDTO => {
        return {
            uid: weightStandard.uid,
            breed: weightStandard.breed,
            week: weightStandard.week,
            minWeight: weightStandard.minWeight,
            targetWeight: weightStandard.targetWeight,
            maxWeight: weightStandard.maxWeight,
            createdAt: weightStandard.createdAt,
            updatedAt: weightStandard.updatedAt,
        };
    },

    toResponseDTOList: (weightStandards: WeightStandardEntity[]): ResponseWeightStandardDTO[] => {
        return weightStandards.map(WeightStandardMapper.toResponseDTO);
    },
};
