import { BreedEntity } from "../../breed/entities/breed.entity";
import { CreateFlockResponseDTO } from "../dtos/create-flock.dto";
import { ResponseFlockDTO } from "../dtos/flock-response.dto";
import { UpdateFlockResponseDTO } from "../dtos/update-flock.dto";
import { FlockEntity } from "../entities/flock.entity";
import { calculateFlockWeeks } from "../utils/flock-calculations";

export const FlockMapper = {
    toResponseDTO: (flock: FlockEntity): ResponseFlockDTO => {
        return {
            uid: flock.uid,
            platformUID: flock.platformUID,
            breedUID: flock.breedUID,
            name: flock.name,
            quantity: flock.quantity,
            birthDate: flock.birthDate,
            arrivalDate: flock.arrivalDate,
            status: flock.status,
            weeks: calculateFlockWeeks(flock.birthDate ?? null),
            description: flock.description,
            createdBy: flock.createdBy,
            updatedBy: flock.updatedBy,
            createdAt: flock.createdAt,
            updatedAt: flock.updatedAt,
        };
    },

    toResponseDTOList: (flocks: FlockEntity[]): ResponseFlockDTO[] => {
        return flocks.map(FlockMapper.toResponseDTO);
    },

    toListResponseDTO: (
        flock: FlockEntity,
        breed: Pick<BreedEntity, "name" | "urlImage">
    ): ResponseFlockDTO => ({
        uid: flock.uid,
        platformUID: flock.platformUID!,

        name: flock.name,
        breedUID: flock.breedUID,
        breedName: breed.name,
        breedUrlImage: breed.urlImage,

        quantity: flock.quantity,

        birthDate: flock.birthDate,
        arrivalDate: flock.arrivalDate,

        status: flock.status,

        weeks: calculateFlockWeeks(flock.birthDate ?? null),

        description: flock.description,

        createdBy: flock.createdBy,
        updatedBy: flock.updatedBy,
        createdAt: flock.createdAt,
        updatedAt: flock.updatedAt,
    }),

    toCreateResponseDTO: (flock: FlockEntity): CreateFlockResponseDTO => {
        return {
            uid: flock.uid,
            name: flock.name,
            breedUID: flock.breedUID,
            platformUID: flock.platformUID,
            weeks: calculateFlockWeeks(flock.birthDate ?? null),
            quantity: flock.quantity,
            birthDate: flock.birthDate,
            arrivalDate: flock.arrivalDate,
            status: flock.status,
            description: flock.description,
            createdBy: flock.createdBy,
            createdAt: flock.createdAt,
        };
    },

    toUpdatedResponseDTO: (flock: FlockEntity): UpdateFlockResponseDTO => {
        return {
            uid: flock.uid,
            breedUID: flock.breedUID,
            weeks: calculateFlockWeeks(flock.birthDate ?? null),
            name: flock.name,
            quantity: flock.quantity,
            birthDate: flock.birthDate,
            arrivalDate: flock.arrivalDate,
            status: flock.status,
            description: flock.description,
            updatedBy: flock.updatedBy,
            updatedAt: flock.updatedAt,
        };
    },
};
