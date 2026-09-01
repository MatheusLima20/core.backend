import { ResponseBreedDTO } from "../dtos/breed-response.dto";
import { CreateBreedResponseDTO } from "../dtos/create-breed.dto";
import { UpdateBreedResponseDTO } from "../dtos/update-breed.dto";
import { BreedEntity } from "../entities/breed.entity";

export const BreedMapper = {
    toResponseDTO: (breed: BreedEntity): ResponseBreedDTO => {
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

    toResponseDTOList: (breeds: BreedEntity[]): ResponseBreedDTO[] => {
        return breeds.map(BreedMapper.toResponseDTO);
    },

    toCreateResponseDTO: (breed: BreedEntity): CreateBreedResponseDTO => {
        return {
            uid: breed.uid,
            platformUID: breed.platformUID,
            name: breed.name,
            scientificName: breed.scientificName,
            eggColor: breed.eggColor,
            breedPurpose: breed.breedPurpose,
            description: breed.description,
            createdAt: breed.createdAt,
            createdBy: breed.createdBy,
        };
    },

    toUpdatedResponseDTO: (breed: BreedEntity): UpdateBreedResponseDTO => {
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
