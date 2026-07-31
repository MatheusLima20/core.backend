import { CreateMortalityResponseDTO } from "../dtos/create-mortality.dto";
import { ResponseMortalityDTO } from "../dtos/mortality-response-dto";
import { UpdateMortalityResponseDTO } from "../dtos/update-mortality.dto";
import { MortalityProps } from "../entities/mortality.props";

export const MortalityMapper = {
    toResponseDTO: (mortality: MortalityProps): ResponseMortalityDTO => {
        return {
            uid: mortality.uid,
            platformUID: mortality.platformUID,
            flockUID: mortality.flockUID,
            mortalityDate: mortality.mortalityDate,
            quantity: mortality.quantity,
            cause: mortality.cause,
            notes: mortality.notes,
            createdBy: mortality.createdBy,
            updatedBy: mortality.updatedBy,
            createdAt: mortality.createdAt,
            updatedAt: mortality.updatedAt,
        };
    },

    toResponseDTOList: (mortalities: MortalityProps[]): ResponseMortalityDTO[] => {
        return mortalities.map(MortalityMapper.toResponseDTO);
    },

    toCreateResponseDTO: (mortality: MortalityProps): CreateMortalityResponseDTO => {
        return {
            uid: mortality.uid,
            platformUID: mortality.platformUID,
            flockUID: mortality.flockUID,
            mortalityDate: mortality.mortalityDate,
            quantity: mortality.quantity,
            cause: mortality.cause,
            notes: mortality.notes,
            createdBy: mortality.createdBy,
            createdAt: mortality.createdAt,
        };
    },

    toUpdatedResponseDTO: (mortality: MortalityProps): UpdateMortalityResponseDTO => {
        return {
            uid: mortality.uid,
            flockUID: mortality.flockUID,
            mortalityDate: mortality.mortalityDate,
            quantity: mortality.quantity,
            cause: mortality.cause,
            notes: mortality.notes,
            updatedBy: mortality.updatedBy,
            updatedAt: mortality.updatedAt,
        };
    },
};
