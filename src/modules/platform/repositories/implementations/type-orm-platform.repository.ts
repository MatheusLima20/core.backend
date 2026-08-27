import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindPlatformsDTO } from "../../dto/find-platform.dto";
import { PlatformEntity } from "../../entities/platform.entities";
import { PlatformProps } from "../../entities/platform.props";
import { IPlatformRepository } from "../platform-repository.interface";

export class TypeORMPlatformRepository implements IPlatformRepository {
    constructor(private readonly repository: Repository<PlatformEntity>) {}

    async find(
        platformUIDs: string[],
        data: FindPlatformsDTO = {}
    ): Promise<Result<PaginationResult<PlatformProps>>> {
        const page = data.page ?? 1;
        const limit = data.limit ?? 10;

        if (platformUIDs.length === 0) {
            return ResultFactory.success({
                data: [],
                page,
                limit,
                total: 0,
                totalPages: 0,
            });
        }

        const query = this.repository
            .createQueryBuilder("platform")
            .where("platform.uid IN (:...platformUIDs)", {
                platformUIDs,
            });

        if (data.name) {
            query.andWhere("platform.name ILIKE :name", {
                name: `%${data.name}%`,
            });
        }

        if (data.category) {
            query.andWhere("platform.category = :category", {
                category: data.category,
            });
        }

        if (data.isActivated !== undefined) {
            query.andWhere("platform.isActivated = :isActivated", {
                isActivated: data.isActivated,
            });
        }

        if (data.orderBy) {
            query.orderBy(`platform.${data.orderBy}`, data.order === "desc" ? "DESC" : "ASC");
        }

        query.skip((page - 1) * limit);
        query.take(limit);

        const [platforms, total] = await query.getManyAndCount();

        return ResultFactory.success({
            data: platforms,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async findByUID(uid: string): Promise<Result<PlatformProps | null>> {
        const platform = await this.repository.findOne({
            where: {
                uid,
            },
        });

        return ResultFactory.success(platform ? platform : null);
    }

    async findByName(name: string): Promise<Result<PlatformProps | null>> {
        const platform = await this.repository.findOne({
            where: {
                name,
            },
        });

        return ResultFactory.success(platform ? platform : null);
    }

    async register(platform: PlatformProps): Promise<Result<PlatformProps>> {
        const savedPlatform = await this.repository.save(platform);

        return ResultFactory.success(savedPlatform);
    }

    async update(platform: PlatformProps): Promise<Result<PlatformProps>> {
        const updatedPlatform = await this.repository.save(platform);

        return ResultFactory.success(updatedPlatform);
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const result = await this.repository.delete({
            uid,
        });

        return ResultFactory.success(result.affected !== 0);
    }
}
