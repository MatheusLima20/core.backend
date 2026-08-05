import { CreateVaccinationResponseDTO } from "../dtos/create-vaccination.dto";
import { UpdateVaccinationResponseDTO } from "../dtos/update-vaccination.dto";
import { ResponseVaccinationDTO } from "../dtos/vaccination-response.dto";
import { VaccinationProps } from "../entities/vaccination.props";

export const VaccinationMapper = {
    toResponseDTO: (vaccination: VaccinationProps): ResponseVaccinationDTO => {
        return {
            uid: vaccination.uid,
            platformUID: vaccination.platformUID,
            flockUID: vaccination.flockUID,
            itemUID: vaccination.itemUID,
            applicationDate: vaccination.applicationDate,
            dose: vaccination.dose,
            batch: vaccination.batch,
            nextDoseDate: vaccination.nextDoseDate,
            notes: vaccination.notes,
            createdBy: vaccination.createdBy,
            updatedBy: vaccination.updatedBy,
            createdAt: vaccination.createdAt,
            updatedAt: vaccination.updatedAt,
        };
    },

    toResponseDTOList: (vaccinations: VaccinationProps[]): ResponseVaccinationDTO[] => {
        return vaccinations.map(VaccinationMapper.toResponseDTO);
    },

    toCreateResponseDTO: (vaccination: VaccinationProps): CreateVaccinationResponseDTO => {
        return {
            uid: vaccination.uid,
            platformUID: vaccination.platformUID,
            flockUID: vaccination.flockUID,
            itemUID: vaccination.itemUID,
            applicationDate: vaccination.applicationDate,
            dose: vaccination.dose,
            batch: vaccination.batch,
            nextDoseDate: vaccination.nextDoseDate,
            notes: vaccination.notes,
            createdBy: vaccination.createdBy,
            createdAt: vaccination.createdAt,
        };
    },

    toUpdatedResponseDTO: (vaccination: VaccinationProps): UpdateVaccinationResponseDTO => {
        return {
            uid: vaccination.uid,
            flockUID: vaccination.flockUID,
            itemUID: vaccination.itemUID,
            applicationDate: vaccination.applicationDate,
            dose: vaccination.dose,
            batch: vaccination.batch,
            nextDoseDate: vaccination.nextDoseDate,
            notes: vaccination.notes,
            updatedBy: vaccination.updatedBy,
            updatedAt: vaccination.updatedAt,
        };
    },
};
