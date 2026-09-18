import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindContentsDTO } from "../../dtos/find-contents.dto";
import { ContentEntity } from "../../entities/content.entity";
import { IContentRepository } from "../content-repository.interface";

export class TypeORMContentRepository implements IContentRepository {
    constructor(private readonly contentRepository: Repository<ContentEntity>) {}

    async findByUID(uid: string, platformUID?: string): Promise<Result<ContentEntity | null>> {
        const query = this.contentRepository
            .createQueryBuilder("content")
            .where("content.uid = :uid", {
                uid,
            });

        if (platformUID) {
            query.andWhere("content.platformUID = :platformUID", {
                platformUID,
            });
        }

        const content = await query.getOne();

        return ResultFactory.success(content);
    }

    async find(
        filters?: FindContentsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ContentEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.contentRepository.createQueryBuilder("content");

        if (platformUID) {
            query.andWhere("content.platformUID = :platformUID", {
                platformUID,
            });
        }

        if (filters?.type) {
            query.andWhere("content.type = :type", {
                type: filters.type,
            });
        }

        if (filters?.name) {
            query.andWhere("content.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.mimeType) {
            query.andWhere("content.mimeType = :mimeType", {
                mimeType: filters.mimeType,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `content.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(content: ContentEntity): Promise<Result<ContentEntity>> {
        const savedContent = await this.contentRepository.save(content);

        return ResultFactory.success(savedContent);
    }

    async update(content: ContentEntity): Promise<Result<ContentEntity>> {
        const savedContent = await this.contentRepository.save(content);

        return ResultFactory.success(savedContent);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.contentRepository.delete(uid);

        return ResultFactory.ok();
    }
}
