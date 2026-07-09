import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindContentsDTO } from "../../dtos/find-content.dto";
import { ContentProps } from "../../entities/content.props";
import { IContentRepository } from "../content-repository.interface";

export class InMemoryContentRepository implements IContentRepository {
    private contents: ContentProps[] = [];

    async find(
        platformUID: string,
        filters?: FindContentsDTO
    ): Promise<Result<ContentProps[], PersistenceError>> {
        let contents = this.contents.filter((content) => content.platformUID === platformUID);

        if (filters?.title) {
            const title = filters.title.toLowerCase();

            contents = contents.filter((content) => content.title.toLowerCase().includes(title));
        }

        if (filters?.description) {
            const description = filters.description.toLowerCase();

            contents = contents.filter((content) =>
                content.description?.toLowerCase().includes(description)
            );
        }

        if (filters?.type) {
            contents = contents.filter((content) => content.type === filters.type);
        }

        if (filters?.lessonUID) {
            contents = contents.filter((content) => content.lessonUID === filters.lessonUID);
        }

        if (filters?.orderBy) {
            const { orderBy } = filters;
            const order = filters.order ?? "asc";

            contents.sort((a, b) => {
                const left = a[orderBy];
                const right = b[orderBy];

                if (left < right) return order === "asc" ? -1 : 1;
                if (left > right) return order === "asc" ? 1 : -1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            contents = contents.slice(start, end);
        }

        return ResultFactory.success(contents);
    }

    async findByUID(platformUID: string, uid: string): Promise<Result<ContentProps | null>> {
        const content =
            this.contents.find(
                (content) => content.uid === uid && content.platformUID === platformUID
            ) ?? null;

        return ResultFactory.success(content);
    }

    async create(content: ContentProps): Promise<Result<ContentProps>> {
        this.contents.push(content);

        return ResultFactory.success(content);
    }

    async update(content: ContentProps): Promise<Result<ContentProps>> {
        const index = this.contents.findIndex((oldContent) => oldContent.uid === content.uid);

        this.contents[index] = content;

        return ResultFactory.success(content);
    }

    async delete(uid: string): Promise<Result<void>> {
        this.contents = this.contents.filter((content) => content.uid !== uid);

        return ResultFactory.ok();
    }
}
