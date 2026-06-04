import { ContentResponseDTO } from "../dtos/content-response.dto";
import { ContentEntity } from "../entities/content.entity";

export const ContentMapper = {
    toPlatformUIDResponse: (content: ContentEntity): ContentResponseDTO => {
        return {
            uid: content.uid,
            description: content.description,
            platformUID: content.platformUID,
            type: content.type,
            userUID: content.userUID,
            amount: content.amount,
            photo: content.photo,
            value: content.value,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
        };
    },

    toPlatformUIDResponseList: (
        contents: ContentEntity[],
    ): ContentResponseDTO[] => {
        return contents.map(ContentMapper.toPlatformUIDResponse);
    },
};
