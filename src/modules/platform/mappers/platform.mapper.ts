import { CreatePlatformResponseDTO } from "../dto/create-platform.dto";
import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { UpdatePlatformResponseDTO } from "../dto/update-platform.dto";
import { PlatformProps } from "../entities/platform.props";

export const PlatformMapper = {
    toPlatformResponse: (platform: PlatformProps): PlatformResponseDTO => {
        return {
            uid: platform.uid,
            name: platform.name,
            slug: platform.slug,
            category: platform.category,
            isActivated: platform.isActivated,
            createdAt: platform.createdAt,
            updatedAt: platform.updatedAt,
            createdBy: platform.createdBy,
            updatedBy: platform.updatedBy,
        };
    },

    toPlatformResponseList: (platforms: PlatformProps[]): PlatformResponseDTO[] => {
        return platforms.map(PlatformMapper.toPlatformResponse);
    },

    toCreateResponse: (platform: PlatformProps): CreatePlatformResponseDTO => {
        return {
            uid: platform.uid,
            name: platform.name,
            category: platform.category,
        };
    },

    toUpdateResponse: (platform: PlatformProps): UpdatePlatformResponseDTO => {
        return {
            uid: platform.uid,
            name: platform.name,
            category: platform.category,
            isActivated: platform.isActivated,
            slug: platform.slug,
            updatedBy: platform.updatedBy,
            updatedAt: platform.updatedAt,
        };
    },
};
