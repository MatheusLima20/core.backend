import { CreatePlatformDTO } from "../../../dto/create-platform.dto";
import { PlatformCategory } from "../../../enum/platform.category-enum";

export const platform1: CreatePlatformDTO = {
    name: "Beautiful Lag.",
    category: PlatformCategory.GYM,
};

export const platform2: CreatePlatformDTO = {
    name: "Beautiful Arm.",
    category: PlatformCategory.ONBOARDLY,
};

export function makePlatform(data?: Partial<CreatePlatformDTO>): CreatePlatformDTO {
    return {
        ...platform1,
        ...data,
    };
}
