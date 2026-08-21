import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { PlatformResponseDTO } from "../../dto/platform-response.dto";
import { PlatformProps } from "../../entities/platform.props";
import { PlatformCategory } from "../../enum/platform.category-enum";
import { PlatformMapper } from "../../mappers/platform.mapper";
import { IPlatformRepository } from "../platform-repository.interface";

export class InMemoryPlatformRepository implements IPlatformRepository {
    platforms: PlatformProps[] = [
        {
            uid: "1",
            name: "Fitness up.",
            isActivated: true,
            createdBy: null,
            category: PlatformCategory.GYM,
            slug: "",
            updatedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "2",
            name: "Ultimate Body Builder.",
            createdBy: null,
            category: PlatformCategory.GYM,
            slug: "",
            updatedBy: null,
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async find(): Promise<Result<PlatformResponseDTO[]>> {
        return ResultFactory.success(PlatformMapper.toPlatformResponseList(this.platforms));
    }

    async findByUID(uid: string): Promise<Result<PlatformResponseDTO | null>> {
        const platform = this.platforms.find((platform) => platform.uid === uid);

        return ResultFactory.success(platform ? PlatformMapper.toPlatformResponse(platform) : null);
    }

    async findByName(name: string): Promise<Result<PlatformResponseDTO | null>> {
        const platform = this.platforms.find((platform) => platform.name === name);

        return ResultFactory.success(platform ? PlatformMapper.toPlatformResponse(platform) : null);
    }

    async register(platform: PlatformProps): Promise<Result<PlatformProps>> {
        this.platforms.push(platform);

        return ResultFactory.success(platform);
    }

    async update(platform: PlatformProps): Promise<Result<PlatformProps>> {
        const index = this.platforms.findIndex((oldPlatform) => oldPlatform.uid === platform.uid);

        this.platforms[index] = platform;

        return ResultFactory.success(platform);
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const index = this.platforms.findIndex((platform) => platform.uid === uid);

        if (index === -1) {
            return ResultFactory.success(false);
        }

        this.platforms.splice(index, 1);

        return ResultFactory.success(true);
    }
}
