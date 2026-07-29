import { ResponseBreedDTO } from "../dtos/breed-response.dto";
import { UpdateBreedResponseDTO } from "../dtos/update-breed.dto";
import { BreedProps } from "../entities/breed.props";

export const BreedMapper = {
    toResponseDTO: (breed: BreedProps): ResponseBreedDTO => {
        return {
            uid: breed.uid,
            platformUID: breed.platformUID,
            name: breed.name,
            scientificName: breed.scientificName,
            eggColor: breed.eggColor,
            breedPurpose: breed.breedPurpose,
            description: breed.description,
            createdBy: breed.createdBy,
            updatedBy: breed.updatedBy,
            createdAt: breed.createdAt,
            updatedAt: breed.updatedAt,
        };
    },

    toResponseDTOList: (breeds: BreedProps[]): ResponseBreedDTO[] => {
        return breeds.map(BreedMapper.toResponseDTO);
    },

    toUpdatedResponseDTO: (breed: BreedProps): UpdateBreedResponseDTO => {
        return {
            uid: breed.uid,
            name: breed.name,
            scientificName: breed.scientificName,
            eggColor: breed.eggColor,
            breedPurpose: breed.breedPurpose,
            description: breed.description,
            updatedBy: breed.updatedBy,
            updatedAt: breed.updatedAt,
        };
    },
};
