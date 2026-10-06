import { CreateMortalityResponseDTO } from "../dtos/create-mortality.dto";
import { ResponseMortalityDTO } from "../dtos/mortality-response-dto";
import { UpdateMortalityResponseDTO } from "../dtos/update-mortality.dto";
import { MortalityEntity } from "../entities/mortality.entity";

export const MortalityMapper = {
    toResponseDTO: (mortality: MortalityEntity): ResponseMortalityDTO => {
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

    toResponseDTOList: (mortalities: MortalityEntity[]): ResponseMortalityDTO[] => {
        return mortalities.map(MortalityMapper.toResponseDTO);
    },

    toCreateResponseDTO: (mortality: MortalityEntity): CreateMortalityResponseDTO => {
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

    toUpdatedResponseDTO: (mortality: MortalityEntity): UpdateMortalityResponseDTO => {
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
