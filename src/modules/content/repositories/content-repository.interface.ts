import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindContentsDTO } from "../dtos/find-contents.dto";
import { ContentEntity } from "../entities/content.entity";

export interface IContentRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<ContentEntity | null>>;

    find(
        filters?: FindContentsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ContentEntity>>>;

    register(content: ContentEntity): Promise<Result<ContentEntity>>;

    update(content: ContentEntity): Promise<Result<ContentEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
