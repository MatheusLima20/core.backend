import { ContentResponseDTO } from "../dtos/content-response.dto";
import { CreateContentResponseDTO } from "../dtos/create-content.dto";
import { UpdateContentResponseDTO } from "../dtos/update-content.dto";
import { ContentProps } from "../entities/content.props";

export const ContentMapper = {
    toCreatedResponseDTO: (content: ContentProps): CreateContentResponseDTO => {
        return {
            uid: content.uid,
            title: content.title,
            description: content.description,
            platformUID: content.platformUID,
            lessonUID: content.lessonUID,
            order: content.order,
            type: content.type,
            isPreview: content.isPreview,
            createdBy: content.createdBy,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
        };
    },

    toUpdatedResponseDTO: (content: ContentProps): UpdateContentResponseDTO => {
        return {
            uid: content.uid,
            title: content.title,
            description: content.description,
            platformUID: content.platformUID,
            isPreview: content.isPreview,
            lessonUID: content.lessonUID,
            order: content.order,
            type: content.type,
            updatedBy: content.updatedBy,
            updatedAt: content.updatedAt,
        };
    },

    toResponseDTO: (content: ContentProps): ContentResponseDTO => {
        return {
            uid: content.uid,
            title: content.title,
            description: content.description,
            platformUID: content.platformUID,
            lessonUID: content.lessonUID,
            order: content.order,
            type: content.type,
            isPreview: content.isPreview,
            createdBy: content.createdBy,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
            updatedBy: content.updatedBy,
        };
    },

    toResponseDTOList: (contents: ContentProps[]): ContentResponseDTO[] => {
        return contents.map(ContentMapper.toResponseDTO);
    },
};
