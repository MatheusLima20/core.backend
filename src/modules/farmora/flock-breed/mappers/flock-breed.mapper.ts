import { CreateFlockBreedResponseDTO } from "../dtos/create-flock-breed.dto";
import { ResponseFlockBreedDTO } from "../dtos/response-flock-breed.dto";
import { UpdateFlockBreedResponseDTO } from "../dtos/update-flock-breed.dto";
import { FlockBreedEntity } from "../entities/flock-breed.entity";

export const FlockBreedMapper = {
    toResponseDTO: (flockBreed: FlockBreedEntity): ResponseFlockBreedDTO => {
        return {
            uid: flockBreed.uid,
            platformUID: flockBreed.platformUID,
            flockUID: flockBreed.flockUID,
            breedUID: flockBreed.breedUID,
            quantity: flockBreed.quantity,
            createdBy: flockBreed.createdBy,
            updatedBy: flockBreed.updatedBy,
            createdAt: flockBreed.createdAt,
            updatedAt: flockBreed.updatedAt,
        };
    },

    toResponseDTOList: (flockBreeds: FlockBreedEntity[]): ResponseFlockBreedDTO[] => {
        return flockBreeds.map(FlockBreedMapper.toResponseDTO);
    },

    toCreateResponseDTO: (flockBreed: FlockBreedEntity): CreateFlockBreedResponseDTO => {
        return {
            uid: flockBreed.uid,
            platformUID: flockBreed.platformUID,
            flockUID: flockBreed.flockUID,
            breedUID: flockBreed.breedUID,
            quantity: flockBreed.quantity,
            createdBy: flockBreed.createdBy,
            createdAt: flockBreed.createdAt,
        };
    },

    toUpdatedResponseDTO: (flockBreed: FlockBreedEntity): UpdateFlockBreedResponseDTO => {
        return {
            uid: flockBreed.uid,
            flockUID: flockBreed.flockUID,
            breedUID: flockBreed.breedUID,
            quantity: flockBreed.quantity,
            updatedBy: flockBreed.updatedBy,
            updatedAt: flockBreed.updatedAt,
        };
    },
};
