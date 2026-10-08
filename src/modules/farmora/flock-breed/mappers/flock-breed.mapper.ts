import { BreedEntity } from "../../breed/entities/breed.entity";
import { CreateFlockBreedResponseDTO } from "../dtos/create-flock-breed.dto";
import { ResponseFlockBreedDTO } from "../dtos/response-flock-breed.dto";
import { UpdateFlockBreedResponseDTO } from "../dtos/update-flock-breed.dto";
import { FlockBreedEntity } from "../entities/flock-breed.entity";

export const FlockBreedMapper = {
    toResponseDTO: (flockBreed: FlockBreedEntity, breed: BreedEntity): ResponseFlockBreedDTO => {
        return {
            uid: flockBreed.uid,
            platformUID: flockBreed.platformUID,
            flockUID: flockBreed.flockUID,
            breedUID: flockBreed.breedUID,
            breedName: breed.name,
            quantity: flockBreed.quantity,
            createdBy: flockBreed.createdBy,
            updatedBy: flockBreed.updatedBy,
            createdAt: flockBreed.createdAt,
            updatedAt: flockBreed.updatedAt,
        };
    },

    toResponseDTOList: (
        flockBreeds: FlockBreedEntity[],
        breeds: BreedEntity[]
    ): ResponseFlockBreedDTO[] => {
        const breedsByUID = new Map(breeds.map((breed) => [breed.uid, breed]));

        return flockBreeds.map((flockBreed) => {
            const breed = breedsByUID.get(flockBreed.breedUID);

            if (!breed) {
                throw new Error(`Breed not found: ${flockBreed.breedUID}`);
            }

            return FlockBreedMapper.toResponseDTO(flockBreed, breed);
        });
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
