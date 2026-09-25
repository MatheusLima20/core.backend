import { CreateEggProductionResponseDTO } from "../dtos/create-egg-production.dto";
import { EggProductionListResponseDTO } from "../dtos/egg-production-list-response.dto";
import { ResponseEggProductionDTO } from "../dtos/egg-production-response.dto";
import { EggProductionSummaryResponseDTO } from "../dtos/egg-production-summary";
import { UpdateEggProductionResponseDTO } from "../dtos/update-egg-production.dto";
import { EggProductionEntity } from "../entities/egg-production.entity";
import { EggProductionWithFlock } from "../types/egg-production-with.flock";

export const EggProductionMapper = {
    toResponseDTO: (eggProduction: EggProductionEntity): ResponseEggProductionDTO => {
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

    toResponseDTOList: (eggProductions: EggProductionEntity[]): ResponseEggProductionDTO[] => {
        return eggProductions.map(EggProductionMapper.toResponseDTO);
    },

    toListResponseDTO(eggProduction: EggProductionWithFlock): EggProductionListResponseDTO {
        return {
            uid: eggProduction.production.uid,
            platformUID: eggProduction.production.platformUID,
            flockUID: eggProduction.production.flockUID,
            flockName: eggProduction.flock.name,
            productionDate: eggProduction.production.productionDate,
            totalEggs: eggProduction.production.totalEggs,
            crackedEggs: eggProduction.production.crackedEggs,
            dirtyEggs: eggProduction.production.dirtyEggs,
            discardedEggs: eggProduction.production.discardedEggs,
            notes: eggProduction.production.notes,
            createdBy: eggProduction.production.createdBy,
            updatedBy: eggProduction.production.updatedBy,
            createdAt: eggProduction.production.createdAt,
            updatedAt: eggProduction.production.updatedAt,
        };
    },

    toCreateResponseDTO: (eggProduction: EggProductionEntity): CreateEggProductionResponseDTO => {
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

    toUpdatedResponseDTO: (eggProduction: EggProductionEntity): UpdateEggProductionResponseDTO => {
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

    toSummaryResponseDTO: (
        summary: EggProductionSummaryResponseDTO
    ): EggProductionSummaryResponseDTO => {
        return {
            totalCollectedToday: summary.totalCollectedToday,
            layingRate: summary.layingRate,
            commercialEggs: summary.commercialEggs,
            discardedEggs: summary.discardedEggs,
        };
    },
};
