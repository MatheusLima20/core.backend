import { CreateWeightResponseDTO } from "../dtos/create-weight.dto";
import { ResponseWeightDTO } from "../dtos/response-weight.dto";
import { UpdateWeightResponseDTO } from "../dtos/update-weight.dto";
import { WeightEntity } from "../entities/weight.entity";

export const WeightMapper = {
    toResponseDTO: (weight: WeightEntity): ResponseWeightDTO => {
        return {
            uid: weight.uid,
            platformUID: weight.platformUID,
            flockUID: weight.flockUID,
            weighingDate: weight.weighingDate,
            averageWeight: weight.averageWeight,
            sampleSize: weight.sampleSize,
            notes: weight.notes,
            createdBy: weight.createdBy,
            updatedBy: weight.updatedBy,
            createdAt: weight.createdAt,
            updatedAt: weight.updatedAt,
        };
    },

    toResponseDTOList: (weights: WeightEntity[]): ResponseWeightDTO[] => {
        return weights.map(WeightMapper.toResponseDTO);
    },

    toCreateResponseDTO: (weight: WeightEntity): CreateWeightResponseDTO => {
        return {
            uid: weight.uid,
            platformUID: weight.platformUID,
            flockUID: weight.flockUID,
            weighingDate: weight.weighingDate,
            averageWeight: weight.averageWeight,
            sampleSize: weight.sampleSize,
            notes: weight.notes,
            createdBy: weight.createdBy,
            createdAt: weight.createdAt,
        };
    },

    toUpdatedResponseDTO: (weight: WeightEntity): UpdateWeightResponseDTO => {
        return {
            uid: weight.uid,
            flockUID: weight.flockUID,
            weighingDate: weight.weighingDate,
            averageWeight: weight.averageWeight,
            sampleSize: weight.sampleSize,
            notes: weight.notes,
            updatedBy: weight.updatedBy,
            updatedAt: weight.updatedAt,
        };
    },
};
