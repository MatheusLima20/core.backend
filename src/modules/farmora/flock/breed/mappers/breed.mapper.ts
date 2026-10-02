import { ResponseBreedDTO } from "../dtos/breed-response.dto";
import { BreedEntity } from "../entities/breed.entity";

export const BreedMapper = {
    toResponseDTO: (breed: BreedEntity): ResponseBreedDTO => {
        return {
            uid: breed.uid,
            name: breed.name,
            scientificName: breed.scientificName,
            eggColor: breed.eggColor,
            urlImage: breed.urlImage,
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
};
