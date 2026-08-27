import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindPlatformsDTO } from "../../dto/find-platform.dto";
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

    async find(
        platformUIDs: string[],
        data: FindPlatformsDTO = {}
    ): Promise<Result<PaginationResult<PlatformProps>>> {
        let platforms = this.platforms.filter((platform) => platformUIDs.includes(platform.uid));

        if (data.name) {
            const name = data.name.toLowerCase();

            platforms = platforms.filter((platform) => platform.name.toLowerCase().includes(name));
        }

        if (data.category) {
            platforms = platforms.filter((platform) => platform.category === data.category);
        }

        if (data.isActivated !== undefined) {
            platforms = platforms.filter((platform) => platform.isActivated === data.isActivated);
        }

        if (data.orderBy) {
            const order = data.order === "desc" ? -1 : 1;

            platforms.sort((a, b) => {
                const first = a[data.orderBy!];
                const second = b[data.orderBy!];

                if (first === second) {
                    return 0;
                }

                return first! > second! ? order : -order;
            });
        }

        const page = data.page ?? 1;
        const limit = data.limit ?? 10;

        const total = platforms.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        return ResultFactory.success({
            data: PlatformMapper.toPlatformResponseList(platforms.slice(start, start + limit)),
            page,
            limit,
            total,
            totalPages,
        });
    }

    async findByUID(uid: string): Promise<Result<PlatformProps | null>> {
        const platform = this.platforms.find((platform) => platform.uid === uid);

        return ResultFactory.success(platform ? PlatformMapper.toPlatformResponse(platform) : null);
    }

    async findByName(name: string): Promise<Result<PlatformProps | null>> {
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
