import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { PlatformEntity } from "../entities/platform.entities";


export const PlatformMapper = {
    toPlatformUIDResponse: (platform: PlatformEntity): PlatformResponseDTO => {
        return {
            uid: platform.uid,
            name: platform.name,
            slug: platform.slug,
            isActivated: platform.isActivated,
            createdAt: platform.createdAt,
            updatedAt: platform.updatedAt,
            createdBy: platform.createdBy,
            updatedBy: platform.updatedBy
        };
    },

    toPlatformUIDResponseList: (
        platforms: PlatformEntity[],
    ): PlatformResponseDTO[] => {
        return platforms.map(PlatformMapper.toPlatformUIDResponse);
    },
};
