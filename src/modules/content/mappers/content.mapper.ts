import { ContentResponseDTO } from "../dtos/content-response.dto";
import { CreateContentResponseDTO } from "../dtos/create-content.dto";
import { UpdateContentResponseDTO } from "../dtos/update-content.dto";
import { ContentEntity } from "../entities/content.entity";

export const ContentMapper = {
    toResponseDTO: (content: ContentEntity): ContentResponseDTO => {
        return {
            uid: content.uid,
            platformUID: content.platformUID,
            type: content.type,
            url: content.url,
            alt: content.alt,
            name: content.name,
            mimeType: content.mimeType,
            size: content.size,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
            createdBy: content.createdBy,
            updatedBy: content.updatedBy,
        };
    },

    toResponseDTOList: (contents: ContentEntity[]): ContentResponseDTO[] => {
        return contents.map(ContentMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (content: ContentEntity): CreateContentResponseDTO => {
        return {
            uid: content.uid,
            type: content.type,
            url: content.url,
            alt: content.alt,
            name: content.name,
            mimeType: content.mimeType,
            size: content.size,
            createdAt: content.createdAt,
            createdBy: content.createdBy,
        };
    },

    toUpdatedResponseDTO: (content: ContentEntity): UpdateContentResponseDTO => {
        return {
            uid: content.uid,
            type: content.type,
            url: content.url,
            alt: content.alt,
            name: content.name,
            mimeType: content.mimeType,
            size: content.size,
            updatedAt: content.updatedAt,
            updatedBy: content.updatedBy,
        };
    },
};
