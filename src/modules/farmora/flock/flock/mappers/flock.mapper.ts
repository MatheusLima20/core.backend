import { CreateFlockResponseDTO } from "../dtos/create-flock.dto";
import { ResponseFlockDTO } from "../dtos/flock-response.dto";
import { UpdateFlockResponseDTO } from "../dtos/update-flock.dto";
import { FlockEntity } from "../entities/flock.entity";

export const FlockMapper = {
    toResponseDTO: (flock: FlockEntity): ResponseFlockDTO => {
        return {
            uid: flock.uid,
            platformUID: flock.platformUID,
            name: flock.name,
            quantity: flock.quantity,
            birthDate: flock.birthDate,
            arrivalDate: flock.arrivalDate,
            status: flock.status,
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

    toCreateResponseDTO: (flock: FlockEntity): CreateFlockResponseDTO => {
        return {
            uid: flock.uid,
            name: flock.name,
            platformUID: flock.platformUID,
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
