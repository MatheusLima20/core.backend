import { CreateEggProductionResponseDTO } from "../dtos/create-egg-production.dto";
import { ResponseEggProductionDTO } from "../dtos/egg-production-response.dto";
import { UpdateEggProductionResponseDTO } from "../dtos/update-egg-production.dto";
import { EggProductionProps } from "../entities/egg-production.props";

export const EggProductionMapper = {
    toResponseDTO: (eggProduction: EggProductionProps): ResponseEggProductionDTO => {
        return {
            uid: eggProduction.uid,
            platformUID: eggProduction.platformUID,
            flockUID: eggProduction.flockUID,
            productionDate: eggProduction.productionDate,
            totalEggs: eggProduction.totalEggs,
            crackedEggs: eggProduction.crackedEggs,
            dirtyEggs: eggProduction.dirtyEggs,
            discardedEggs: eggProduction.discardedEggs,
            notes: eggProduction.notes,
            createdBy: eggProduction.createdBy,
            updatedBy: eggProduction.updatedBy,
            createdAt: eggProduction.createdAt,
            updatedAt: eggProduction.updatedAt,
        };
    },

    toResponseDTOList: (eggProductions: EggProductionProps[]): ResponseEggProductionDTO[] => {
        return eggProductions.map(EggProductionMapper.toResponseDTO);
    },

    toCreateResponseDTO: (eggProduction: EggProductionProps): CreateEggProductionResponseDTO => {
        return {
            uid: eggProduction.uid,
            platformUID: eggProduction.platformUID,
            flockUID: eggProduction.flockUID,
            productionDate: eggProduction.productionDate,
            totalEggs: eggProduction.totalEggs,
            crackedEggs: eggProduction.crackedEggs,
            dirtyEggs: eggProduction.dirtyEggs,
            discardedEggs: eggProduction.discardedEggs,
            notes: eggProduction.notes,
            createdBy: eggProduction.createdBy,
            createdAt: eggProduction.createdAt,
        };
    },

    toUpdatedResponseDTO: (eggProduction: EggProductionProps): UpdateEggProductionResponseDTO => {
        return {
            uid: eggProduction.uid,
            flockUID: eggProduction.flockUID,
            productionDate: eggProduction.productionDate,
            totalEggs: eggProduction.totalEggs,
            crackedEggs: eggProduction.crackedEggs,
            dirtyEggs: eggProduction.dirtyEggs,
            discardedEggs: eggProduction.discardedEggs,
            notes: eggProduction.notes,
            updatedBy: eggProduction.updatedBy,
            updatedAt: eggProduction.updatedAt,
        };
    },
};
