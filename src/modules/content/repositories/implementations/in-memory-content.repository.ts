import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindContentsDTO } from "../../dtos/find-contents.dto";
import { ContentEntity } from "../../entities/content.entity";
import { IContentRepository } from "../content-repository.interface";

export class InMemoryContentRepository implements IContentRepository {
    private contents: ContentEntity[] = [];

    async findByUID(uid: string, platformUID: string): Promise<Result<ContentEntity | null>> {
        const content =
            this.contents.find(
                (content) => content.platformUID === platformUID && content.uid === uid
            ) ?? null;

        return ResultFactory.success(content);
    }

    async find(
        filters?: FindContentsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ContentEntity>>> {
        let contents = this.contents;

        if (platformUID) {
            contents = contents.filter((content) => content.platformUID === platformUID);
        }

        if (filters?.type) {
            contents = contents.filter((content) => content.type === filters.type);
        }

        if (filters?.name) {
            contents = contents.filter((content) =>
                content.name?.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.mimeType) {
            contents = contents.filter((content) => content.mimeType === filters.mimeType);
        }

        if (filters?.orderBy) {
            contents.sort((a, b) => {
                const valueA = a[filters.orderBy!] ?? "";
                const valueB = b[filters.orderBy!] ?? "";

                if (valueA < valueB) {
                    return filters.order === "desc" ? 1 : -1;
                }

                if (valueA > valueB) {
                    return filters.order === "desc" ? -1 : 1;
                }

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = contents.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = contents.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(content: ContentEntity): Promise<Result<ContentEntity>> {
        this.contents.push(content);

        return ResultFactory.success(content);
    }

    async update(content: ContentEntity): Promise<Result<ContentEntity>> {
        const index = this.contents.findIndex((item) => item.uid === content.uid);

        this.contents[index] = content;

        return ResultFactory.success(content);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.contents.findIndex((content) => content.uid === uid);

        if (index !== -1) {
            this.contents.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
