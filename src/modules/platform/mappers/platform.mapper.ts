import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { PlatformEntity } from "../entities/platform.entities";


export const PlatformMapper = {
    toPlatformUIDResponse: (platform: PlatformEntity): PlatformResponseDTO => {
        return {
            uid: platform.uid,
            name: platform.name,
            isActivated: platform.isActivated,
            createdAt: platform.createdAt,
            updatedAt: platform.updatedAt,
        };
    },

    toPlatformUIDResponseList: (
        platforms: PlatformEntity[],
    ): PlatformResponseDTO[] => {
        return platforms.map(PlatformMapper.toPlatformUIDResponse);
    },
};
